const db = require('_helpers/db');
const Agent = db.Agent;
const Policy = db.Policy;
const User = db.User;
const AdvanceAmount = db.AdvanceAmount;
const Insurer = db.Insurer;

module.exports = {
    getAll,
    create,
    getById,
    update,
    delete: _delete,
};

async function create(userParam) {
    console.log('advanceAmount create:');
    // validate  
    if (await AdvanceAmount.findOne({ posp_code: userParam.posp_code })) {
        throw 'POSP Code: "' + userParam.posp_code + '" is already taken';
    }
    const advanceAmount = new AdvanceAmount(userParam);
    // save user
    await advanceAmount.save();
}

async function getAll() {
    console.log('advanceAmount getAll:');
    return await AdvanceAmount.find().sort({ createdAt: -1 })
}

async function update(id, userParam) {
    const advanceAmount = await AdvanceAmount.findById(id);
    if (!advanceAmount) throw 'AdvanceAmount not found';
    // if (await AdvanceAmount.findOne({ posp_code: userParam.posp_code.toUpperCase() })) {
    //     throw 'Name "' + userParam.posp_code + '" is already taken';
    // }
    // copy userParam properties to advanceAmount
    Object.assign(advanceAmount, userParam);
    await advanceAmount.save();
}

async function _delete(id) {
    await AdvanceAmount.findByIdAndRemove(id);
}

async function getById(id) {
    return await AdvanceAmount.findById(id);
}

