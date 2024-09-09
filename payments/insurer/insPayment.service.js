const db = require('_helpers/db');
const Insurer = db.InsPayment;
const User = db.User;
const Policy = db.Policy;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
    getByName,
    createMany,
    getAllProcessing,
    getAllDone,
    setStatusToReadOnly,
    setStatusToActive,
    getByIds,
    deleteMany,
    deletePayments,
};


async function getAll() {
    console.log('insurers getAll calling:');
    return await Insurer.find({ status: "ACTIVE" }).sort({ createdAt: -1 });
}

async function getById(id) {
    return await Insurer.findById(id);
}

async function create(userParam) {
    if (await Insurer.findOne({ name: userParam.name.toUpperCase() })) {
        throw 'Name "' + userParam.name + '" is already taken';
    }
    const insurer = new Insurer(userParam);
    await insurer.save();
}

async function update(id, userParam) {
    const insurer = await Insurer.findById(id);
    if (!insurer) throw 'Insurer not found';
    if (userParam.name) {
        if (insurer.name !== userParam.name && await Insurer.findOne({ name: userParam.name.toUpperCase() })) {
            throw 'Name "' + userParam.name + '" is already taken';
        }
    }

    // copy userParam properties to Insurer
    Object.assign(insurer, userParam);
    await insurer.save();
}

async function _delete(id) {
    await Insurer.findByIdAndRemove(id);
}

async function getAllActive() {
    console.log('insurers getAllActive calling:');
    return await Insurer.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}

async function getByName(name) {
    const exists = await Insurer.findOne({ name }).select('-_id name');
    console.log(exists);
    if (exists) {
        return 'true';
    } else {
        return 'false';
    }
}

async function getAllProcessing() {
    console.log('insurer payments getAllProcessing calling:');
    return await Insurer.find({ status: "PROCESSING" }).sort({ createdAt: -1 });
}

async function getAllDone(year, month) {
    console.log('payments insurer getAllDone calling:');
    console.log(year, '  ', month);

    const year1 = Number.parseInt(year);
    const month1 = Number.parseInt(month);

    // Construct a date range for the specified year and month  
    let startDate = new Date(Date.UTC(year1, month1 - 1, 1)); // Month is zero-based in JavaScript Date
    let endDate = new Date(Date.UTC(year1, month1, 1)); // Get the last day of the month

    console.log(startDate);
    console.log(endDate);

    return await Insurer.find({ createdAt: { $gte: startDate, $lte: endDate }, status: "DONE" }).sort({ createdAt: -1 });
}

async function setStatusToReadOnly(body) {
    console.log('insurer payments setStatusToReadOnly calling:');

    // console.log(body.loginId);
    // console.log(body.policyList);

    // let user =  await User.find({loginId : body.loginId})
    // console.log(user);

    if (body.loginId !== '1E7CE893FBCE4BC') {
        console.log('payment confirmation failed!, loginId didn`t matching..');
        return ['You are not eligible to confirm payments!']
    }

    // return []

    // List of document IDs
    const docIds = body.policyList;

    // Define your update criteria
    const filter = { _id: { $in: docIds } };

    // Define the update operation
    const update = { $set: { status: 'DONE' } };

    // Array to store IDs of documents that failed to update
    const failedUpdates = [];

    // Function to update status for a single document
    const updateStatus = async (docId) => {
        try {
            await Insurer.updateOne({ _id: docId }, update);
        } catch (err) {
            console.error(`Failed to update status for document with ID: ${docId}`);
            failedUpdates.push(docId);
        }
    };

    // Update status for each document
    const updatePromises = docIds.map(updateStatus);

    // Wait for all updates to complete
    await Promise.all(updatePromises)
        .then(() => {
            if (failedUpdates.length > 0) {
                console.log(`Failed to update status for the following document IDs: ${failedUpdates.join(', ')}`);
            } else {
                console.log('All documents updated successfully');
            }
        })
        .catch((err) => {
            console.error(err);
        });


    return failedUpdates
}

async function setStatusToActive(body) {
    console.log('payments setStatusToActive calling:');

    // console.log(body.loginId);
    // console.log(body.policyList);

    // let user =  await User.find({loginId : body.loginId})
    // console.log(user);

    if (body.loginId !== '1E7CE893FBCE4BC') {
        console.log('payment confirmation failed!, loginId didn`t matching..');
        return ['You are not eligible to confirm payments!']
    }

    // return []

    // List of document IDs
    const docIds = body.policyList;

    // Define your update criteria
    const filter = { _id: { $in: docIds } };

    // Define the update operation
    const update = { $set: { status: 'ACTIVE' } };

    // Array to store IDs of documents that failed to update
    const failedUpdates = [];

    // Function to update status for a single document
    const updateStatus = async (docId) => {
        try {
            await Insurer.updateOne({ _id: docId }, update);
        } catch (err) {
            console.error(`Failed to update status for document with ID: ${docId}`);
            failedUpdates.push(docId);
        }
    };

    // Update status for each document
    const updatePromises = docIds.map(updateStatus);

    // Wait for all updates to complete
    await Promise.all(updatePromises)
        .then(() => {
            if (failedUpdates.length > 0) {
                console.log(`Failed to update status for the following document IDs: ${failedUpdates.join(', ')}`);
            } else {
                console.log('All documents updated successfully');
            }
        })
        .catch((err) => {
            console.error(err);
        });


    return failedUpdates
}

async function getByIds(ids) {
    console.log('pos payments getByIds calling:');
    const idArray = ids.split(',');
    return await Insurer.find({ _id: { $in: idArray }, });
}

async function deleteMany(ids) {
    console.log('pos payments deleteMany calling:');
    const idArray = ids.split(',');
    return await Insurer.deleteMany({ _id: { $in: idArray }, });
}

async function deletePayments(userParam) {
    console.log('payments insurer deletePayments calling:');
    console.log(userParam);

    let isDone = false

    try {
        // collecting payments ids
        payments_ids = []
        for (const key in userParam) {
            payments_ids.push(userParam[key].id)
        }

        // collecting policy ids
        policy_ids = []
        for (const key in userParam) {
            policyIdList = userParam[key].policyIdList;
            for (let id in policyIdList)
                policy_ids.push(policyIdList[id])
        }

        console.log(payments_ids);
        console.log(policy_ids);

        // return null

        // deleting payments
        await Insurer.deleteMany({ _id: { $in: payments_ids }, });

        policies = await Policy.find({ _id: { $in: policy_ids }, });
        console.log(policies);

        count = 0;

        await policies.forEach(async function (doc) {
            doc.status = 'ACTIVE'
            await doc.save();
            count++;
        });

        console.log(count);

        isDone = true

    } catch (error) {
        console.error('Error:', error);
    }
    return isDone

}

async function createMany(userParam) {
    console.log('insurer payments createMany calling:');
    console.log('userParam ', userParam);
    let isDone = false
    try {

        // collecting posp_code for deleting 
        posp_codes = []
        for (const key in userParam) {
            list = userParam[key].policyIdList
            for (const k in list) {
             
                posp_codes.push(list[k])
                    
            }
        }
        console.log('posp_codes ', posp_codes);



        await Insurer.deleteMany({ policyIdList: { $in: posp_codes }, status: "PROCESSING" });

        // mapping for new objects
        const result = userParam.map(obj => {
            const newObj = {};
            for (const key in obj) {
                newObj[key] = obj[key];
            }
            return newObj;
        });
        console.log('result ', result);
       
        output_result = await Insurer.insertMany(result);
        // console.log(output_result);
        console.log('Documents inserted');
        isDone = true

    } catch (error) {
        console.error('Error:', error);
    }
    return isDone

}


