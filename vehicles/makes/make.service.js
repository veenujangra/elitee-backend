const db = require('_helpers/db');
const Make = db.Make;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
};

async function getAll() {
    console.log('vehicles make getAll calling: ');    
    return await Make.find({ status: "ACTIVE" }).sort({ createdAt: -1 });
}

async function getById(id) {
    return await Make.findById(id);
}

async function create(policyParam) {
    const make = new Make(policyParam);
    await make.save();
}

async function update(id, userParam) {
    const make = await Make.findById(id);
    if (!make) throw 'Make not found';
    // copy userParam properties to make
    Object.assign(make, userParam);
    await make.save();
}

async function _delete(id) {
    await Make.findByIdAndRemove(id);
}

async function getAllActive() {
    return await Make.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}