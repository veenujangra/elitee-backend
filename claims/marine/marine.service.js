const db = require('_helpers/db');
const MarineClaim = db.MarineClaim;
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
    return await MarineClaim.find().sort({ createdAt: -1 });
}

async function getById(id) {
    return await MarineClaim.findById(id);
}

async function create(userParam) {
    // if (await MarineClaim.findOne({ name: userParam.name.toUpperCase() })) {
    //     throw 'Name "' + userParam.name + '" is already taken';
    // }
    const marineClaim = new MarineClaim(userParam);
    await marineClaim.save();
}

async function update(id, userParam) {
    const marineClaim = await MarineClaim.findById(id);
    if (!marineClaim) throw 'Motor claim not found';
    // if (await MarineClaim.findOne({ name: userParam.name.toUpperCase() })) {
    //     throw 'Name "' + userParam.name + '" is already taken';
    // }
    // copy userParam properties to MarineClaim
    Object.assign(marineClaim, userParam);
    await marineClaim.save();
}

async function _delete(id) {
    await MarineClaim.findByIdAndRemove(id);
}

async function getAllActive() {
    return await MarineClaim.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}

async function getAllById(id) {
    console.log('marine claim getAllById calling: ');
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        return await MarineClaim.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
    else if (user && user.role === 'ADMIN') {
        return await MarineClaim.find({ profileId: user.loginId, status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
}

async function getPending(id) {
    console.log('marine claim getPending claiming ');
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        return await MarineClaim.find({ status: 'PENDING' }).sort({ createdAt: -1 })
    }
    else if (user && user.role === 'ADMIN') {
        return await MarineClaim.find({ profileId: user.loginId, status: 'PENDING' }).sort({ createdAt: -1 })
    }    
}