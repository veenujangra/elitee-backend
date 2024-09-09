const db = require('_helpers/db');
const Model = db.Model;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
};

async function getAll() {
    console.log('vehicles model getAll calling: ');   
    return await Model.find({ status: "ACTIVE" }).sort({ createdAt: -1 });
}

async function getById(id) {
    return await Model.findById(id);
}

async function create(policyParam) {
    const model = new Model(policyParam);
    await model.save();
}

async function update(id, userParam) {
    const model = await Model.findById(id);
    if (!model) throw 'Model not found';
    // copy userParam properties to model
    Object.assign(model, userParam);
    await model.save();
}

async function _delete(id) {
    await Model.findByIdAndRemove(id);
}

async function getAllActive() {
    return await Model.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}