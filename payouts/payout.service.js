require('dotenv').config();
const db = require('_helpers/db');
const Payout = db.Payout;

module.exports = {
    getAll,
    getById,
    create,
    createMany,
    update,
    delete: _delete,
    getAllActiveEndDate,
    getAllFromDate,
    getAllBySlab,
};


async function getAll() {
    console.log('payouts getAll calling:');
    return await Payout.find({ status: 'ACTIVE' }).sort({ createdAt: -1 })
}

async function getAllActiveEndDate() {
    console.log('payouts getAllActiveEndDate calling:' );    
    return await Payout.find({ status: 'ACTIVE' });   
}

async function getAllFromDate() {
    console.log('payouts getAllFromDate calling:' );

    // dt1 = new Date()
    // dt2 = new Date()

    const moment = require('moment');

    // Calculate dates
    const dt1 = moment(new Date()).subtract(1, 'day').toDate(); // 24 hours ago
    const dt2 = new Date(); // Current time

    // console.log(dt1);
    // console.log(dt2);

    // Query documents
    return await Payout.find({ status: 'ACTIVE', startDate: { $gte: dt1, $lte: dt2 } });


    console.log(dt1);
    console.log(dt2);

    return await Payout.find({ status: 'ACTIVE', startDate: { $gte: dt1, $lte: dt2 } });


    return await Payout.find({ status: 'ACTIVE', startDate: { $lte: Date.now() }, endDate: { $gt: Date.now() } })
    return await Payout.find({ status: 'ACTIVE', startDate: { $lte: Date.now() }, endDate: { $gt: Date.now() } })

    return await Policy.find({ risk_start_date: { $gte: dt1, $lte: dt2 } }).sort({ risk_start_date: 1 });

}

async function getById(id) {
    return await Payout.findById(id);
}

async function create(policyParam) {
    const payout = new Payout(policyParam);
    // save Payout
    await payout.save();
}

async function createMany(policyParam) {
    try {
        // Delete all documents in the Payout collection
        await Payout.deleteMany({}).exec();
        console.log('Collection cleared');

        // Iterate through each object
        const result = policyParam.map(obj => {
            const newObj = {};
            // Iterate through each property of the object
            for (const key in obj) {
                if (Object.hasOwnProperty.call(obj, key)) {
                    // Apply trimAndUpperCase function to each property
                    newObj[key] = trimAndUpperCase(obj[key]);
                }
            }
            return newObj;
        });

        // Insert multiple documents into the Payout collection
        await Payout.insertMany(result);
        console.log('Documents inserted');

    } catch (error) {
        console.error('Error:', error);
    }
}

async function update(id, userParam) {
    const payout = await Payout.findById(id);
    if (!payout) throw 'Payout not found';
    // copy userParam properties to payout
    Object.assign(payout, userParam);
    await payout.save();
}

async function _delete(id) {
    await Payout.findByIdAndRemove(id);
}

function trimAndUpperCase(value) {
    if (typeof value === 'string') {
        return value.trim().toUpperCase();
    } else if (Array.isArray(value)) {
        return value.map(item => typeof item === 'string' ? item.trim().toUpperCase() : item);
    }
    return value;
}

async function getAllBySlab(id) {
    console.log('payouts getAllBySlab calling:');
    return await Payout.find({slabId: id, status: 'ACTIVE'});
}