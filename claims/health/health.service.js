const db = require('_helpers/db');
const HealthClaim = db.HealthClaim;
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
    return await HealthClaim.find().sort({ createdAt: -1 });
}

async function getById(id) {
    return await HealthClaim.findById(id);
}

async function create(userParam) {
    // if (await HealthClaim.findOne({ name: userParam.name.toUpperCase() })) {
    //     throw 'Name "' + userParam.name + '" is already taken';
    // }
    const healthClaim = new HealthClaim(userParam);
    await healthClaim.save();
}

async function update(id, userParam) {
    const healthClaim = await HealthClaim.findById(id);   
    if (!healthClaim) throw 'Motor claim not found';
    // if (await HealthClaim.findOne({ name: userParam.name.toUpperCase() })) {
    //     throw 'Name "' + userParam.name + '" is already taken';
    // }
    // copy userParam properties to HealthClaim
    Object.assign(healthClaim, userParam);
    await healthClaim.save();
}

async function _delete(id) {
    await HealthClaim.findByIdAndRemove(id);
}

async function getAllActive() {
    return await HealthClaim.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}

async function getAllById(id) {
    console.log('health claim getAllById calling: ');
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        return await HealthClaim.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
    else if (user && user.role === 'ADMIN') {
        return await HealthClaim.find({ profileId: user.loginId, status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }     
}

async function getPending(id) {
    console.log('health claim getPending claiming ');    
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        return await HealthClaim.find({ status: 'PENDING' }).sort({ createdAt: -1 })
    }
    else if (user && user.role === 'ADMIN') {
        return await HealthClaim.find({ profileId: user.loginId, status: 'PENDING' }).sort({ createdAt: -1 })
    }    
   
}