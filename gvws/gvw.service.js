const db = require("_helpers/db");
const Gvw = db.Gvw;

module.exports = {
    getAll,
    getById,
    getByInsurer,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    console.log('gvws getAll calling:');
    return await Gvw.find({status: "ACTIVE"}).sort({ createdAt: -1 });
}

async function getById(id) {
    return await Gvw.findById(id);
}

async function getByInsurer(insurers) {
    console.log('gvws getByInsurer calling:');
    return await Gvw.find({ status: "ACTIVE", insurer: { $in: insurers.split(",") }, }).sort({ name: 1 }).select('-_id name');
}

async function create(userParam) {
    console.log('gvw create method: ');
    if (await Gvw.findOne({ name: userParam.name.toUpperCase(), insurer: userParam.insurer.toUpperCase() })) {
        throw 'Name "' + userParam.name + '" is already taken';
    }
    const gvw = new Gvw(userParam);
    await gvw.save();
}

async function update(id, userParam) {
    const gvw = await Gvw.findById(id);
    if (!gvw) throw "Gvw not found";
    if (userParam.name) {
        if (gvw.name !== userParam.name && await Gvw.findOne({ name: userParam.name.toUpperCase(), insurer: userParam.insurer.toUpperCase() })) {
            throw 'Name "' + userParam.name + '" is already taken';
        }
    }
    
    // copy userParam properties to gvw
    Object.assign(gvw, userParam);
    await gvw.save();
}

async function _delete(id) {
    await Gvw.findByIdAndRemove(id);
}

