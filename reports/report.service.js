const db = require('_helpers/db');
const Insurer = db.Insurer;
const Agent = db.Agent;
const AdvanceAmount = db.AdvanceAmount;
const Policy = db.Policy;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getReportFromPeriod,
    getInsurerReportFromPeriod,
    getPosSummaryFromPeriod,
    setPolicyStatusToProcessing,
    setPolicyStatusToReadOnly,
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

async function getReportFromPeriod(year, month) {
    console.log('reports getReportFromPeriod calling:');

    console.log(year, '  ', month);

    const year1 = Number.parseInt(year);
    const month1 = Number.parseInt(month);

    // Construct a date range for the specified year and month  
    let startDate = new Date(Date.UTC(year1, month1 - 1, 1)); // Month is zero-based in JavaScript Date
    let endDate = new Date(Date.UTC(year1, month1, 0)); // Get the last day of the month

    console.log(startDate);
    console.log(endDate);

    //  let dt1 = startDate.toString().split('T')[0]
    //  let dt2 = endDate.toString().split('T')[0]

    //  console.log(dt1);
    //  console.log(dt2);

    agents = null
    policies = null
    amountList = null
    agents = await Agent.find({ status: "ACTIVE" }).sort({ createdAt: -1 }).select('_id posp_code fullName account_no pan_no aadhaar_no appointment_date termination_date')
    policies = await Policy.find({
        issue_date: { $gte: startDate, $lte: endDate },
        status: 'ACTIVE',
    }).sort({ createdAt: -1 }).select('pos net pos pos_od pos_tp createdAt');
    // console.log(policies);
    amountList = await AdvanceAmount.find();
    return { agents, policies, amountList }
}

async function getInsurerReportFromPeriod(year, month) {
    console.log('reports getInsurerReportFromPeriod calling:');

    console.log(year, '  ', month);

    const year1 = Number.parseInt(year);
    const month1 = Number.parseInt(month);

    // Construct a date range for the specified year and month  
    let startDate = new Date(Date.UTC(year1, month1 - 1, 1)); // Month is zero-based in JavaScript Date
    let endDate = new Date(Date.UTC(year1, month1, 0)); // Get the last day of the month

    console.log(startDate);
    console.log(endDate);

    //  let dt1 = startDate.toString().split('T')[0]
    //  let dt2 = endDate.toString().split('T')[0]

    //  console.log(dt1);
    //  console.log(dt2);

    insurers = null
    policies = null 
    insurers = await Insurer.find({ status: "ACTIVE" }).select('name').sort({ createdAt: -1 })
    policies = await Policy.find({
        issue_date: { $gte: startDate, $lte: endDate },
        status: 'ACTIVE',
    }).sort({ createdAt: -1 }).
    select('insurance_company experiya_od_commission experiya_tp_commission experiya_od_reward experiya_tp_reward actualA actualB actualC invoiceA invoiceB invoiceC createdAt'); 
  
    return { insurers, policies,  }
}

async function getPosSummaryFromPeriod(year, period) {
    console.log('reports getPosSummaryFromPeriod calling:');
    console.log(year, '  ', period);

    let y = Number.parseInt(year);

    // Construct a date range for the specified year and month  
    let startDate
    let endDate

    if (period === 'April-September') {
        console.log('1st period');
        startDate = new Date(Date.UTC(y, 4 - 1, 1));
        endDate = new Date(Date.UTC(y, 9, 0));
    }
    else if (period === 'October-March') {
        console.log('2nd period');
        startDate = new Date(Date.UTC(y, 10 - 1, 1));
        endDate = new Date(Date.UTC(y + 1, 3, 0));
    }

    console.log(startDate);
    console.log(endDate);

    agents = null
    policies = null
    amountList = null
    total_pos = await Agent.countDocuments({ status: "ACTIVE" })
    engaged_pos = await Agent.countDocuments({ appointment_date: { $gte: startDate, $lte: endDate }, status: "ACTIVE" })
    disengaged_pos = await Agent.countDocuments({ termination_date: { $gte: startDate, $lte: endDate }, })
    return { total_pos, engaged_pos, disengaged_pos }
}

async function setPolicyStatusToProcessing(policyList) {
    console.log('reports setPolicyStatusToProcessing calling:');
    console.log(policyList);

    // List of document IDs
    const docIds = policyList;

    // Define your update criteria
    const filter = { _id: { $in: docIds } };

    // Define the update operation
    const update = { $set: { status: 'PROCESSING' } };

    // Array to store IDs of documents that failed to update
    const failedUpdates = [];

    // Function to update status for a single document
    const updateStatus = async (docId) => {
        try {
            await Policy.updateOne({ _id: docId }, update);
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

async function setPolicyStatusToReadOnly(policyList) {
    console.log('reports setPolicyStatusToReadOnly calling:');
    console.log(policyList);

    // List of document IDs
    const docIds = policyList;

    // Define your update criteria
    const filter = { _id: { $in: docIds } };

    // Define the update operation
    const update = { $set: { status: 'READ_ONLY' } };

    // Array to store IDs of documents that failed to update
    const failedUpdates = [];

    // Function to update status for a single document
    const updateStatus = async (docId) => {
        try {
            await Policy.updateOne({ _id: docId }, update);
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