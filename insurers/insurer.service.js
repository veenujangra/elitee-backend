const db = require('_helpers/db');
const Insurer = db.Insurer;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
    getByName,
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

