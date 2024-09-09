const db = require('_helpers/db');
const MotorClaim = db.MotorClaim;
const User = db.User;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
    getAllById,
    getPending,


};


async function getAll() {
    console.log('motor claim getAll: ');
    return await MotorClaim.find().sort({ createdAt: -1 });
}

async function getById(id) {
    return await MotorClaim.findById(id);
}

async function create(userParam) {
    // if (await MotorClaim.findOne({ name: userParam.name.toUpperCase() })) {
    //     throw 'Name "' + userParam.name + '" is already taken';
    // }
    const motorClaim = new MotorClaim(userParam);
    await motorClaim.save();
}

async function update(id, userParam) {
    const motorClaim = await MotorClaim.findById(id);
    if (!motorClaim) throw 'Motor claim not found';
    // if (await MotorClaim.findOne({ name: userParam.name.toUpperCase() })) {
    //     throw 'Name "' + userParam.name + '" is already taken';
    // }
    // copy userParam properties to MotorClaim
    Object.assign(motorClaim, userParam);
    await motorClaim.save();
}

async function _delete(id) {
    await MotorClaim.findByIdAndRemove(id);
}

async function getAllActive() {
    return await MotorClaim.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}

async function getAllById(id) {
    console.log('motor claim getAllById calling:');
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        return await MotorClaim.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
    else if (user && user.role === 'ADMIN') {
        return await MotorClaim.find({ profileId: user.loginId, status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
}

async function getPending(id) {
    console.log('motor claim getPending claiming ');
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        return await MotorClaim.find({ status: 'PENDING' }).sort({ createdAt: -1 })
    }
    else if (user && user.role === 'ADMIN') {
        return await MotorClaim.find({ profileId: user.loginId, status: 'PENDING' }).sort({ createdAt: -1 })
    }    
}