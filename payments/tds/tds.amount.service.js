const db = require('_helpers/db');
const Insurer = db.PosPayment;

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

async function createMany(userParam) {
    console.log('payments createMany calling:');
    let isDone = false
    try {

        // console.log(userParam);

        // Iterate through each object
        const result = userParam.map(obj => {
            const newObj = {};
            // Iterate through each property of the object
            for (const key in obj) {
                // if (Object.hasOwnProperty.call(obj, key)) {
                newObj[key] = obj[key];
                // }
            }
            return newObj;
        });

        // console.log(result);

        output_result = await Insurer.insertMany(result);
        // console.log(output_result);
        console.log('Documents inserted');
        isDone = true

    } catch (error) {
        console.error('Error:', error);
    }
    return isDone   

}

async function getAllProcessing() {
    console.log('payments getAllProcessing calling:');
    return await Insurer.find({ status: "PROCESSING" }).sort({ createdAt: -1 });
}

async function getAllDone() {
    console.log('payments getAllDone calling:');
    return await Insurer.find({ status: "DONE" }).sort({ createdAt: -1 });
}

async function setStatusToReadOnly(policyList) {
    console.log('payments setStatusToReadOnly calling:');
    console.log(policyList);

    // List of document IDs
    const docIds = policyList;

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
