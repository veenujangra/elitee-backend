const db = require('_helpers/db');
const Salesman = db.Salesman;
const User = db.User;


module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
    getAllByProfileId,
    getAllByBqp,
};


async function getAll() {
    return await Salesman.find().sort({ createdAt: -1 });
}

async function getById(id) {
    return await Salesman.findById(id);
}

async function create(userParam) {
    const salesman = new Salesman(userParam);
    if (await Salesman.findOne({ name: userParam.name.toUpperCase() })) {
        throw 'Name "' + userParam.name + '" is already taken';
    }
    await salesman.save();
}

async function update(id, userParam) {
    const salesman = await Salesman.findById(id);
    if (!salesman) throw 'Salesman not found';
    if (userParam.name) {
        if (salesman.name !== userParam.name &&  await Salesman.findOne({ name: userParam.name.toUpperCase() })) {
            throw 'Name "' + userParam.name + '" is already taken';
        }
    }
   
    // copy userParam properties to salesman
    Object.assign(salesman, userParam);
    await salesman.save();
}

async function _delete(id) {
    await Salesman.findByIdAndRemove(id);
}

async function getAllActive(id) {
    console.log('Salesman getAllActive calling:')
    user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        console.log('super_admin');
        return await Salesman.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
    }
    else if (user && user.role === 'ADMIN') {
        console.log('admin');
        return await Salesman.find({ profileId: user.loginId, status: 'ACTIVE', }).sort({ name: 1 }).select('-_id name')
    }
}

async function getAllByProfileId(id) {
    console.log('salesman getAllByProfileId calling:');
    user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        console.log('super_admin');
        return await Salesman.find({status: 'ACTIVE'}).sort({ createdAt: -1 })
    }
    return await Salesman.find({ profileId: id, status: 'ACTIVE' }).sort({ createdAt: -1 })
}

async function getAllByBqp(name) {
    console.log('Salesman getAllByBqp calling:')
    return await Salesman.find({ bqp: name }).sort({ name: 1 }).select('-_id name')
}