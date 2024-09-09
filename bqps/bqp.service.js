const db = require('_helpers/db');
const Bqp = db.Bqp;
const User = db.User;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
    getAllByProfileId,
};


async function getAll() {
    console.log('bqps getAll calling:');
    return await Bqp.find().sort({ createdAt: -1 });
}

async function getById(id) {
    return await Bqp.findById(id);
}

async function create(userParam) {
    const bqp = new Bqp(userParam);
    if (await Bqp.findOne({ name: userParam.name.toUpperCase() })) {
        throw 'Name "' + userParam.name + '" is already taken';
    }
    await bqp.save();
}

async function update(id, userParam) {
    const bqp = await Bqp.findById(id);
    if (!bqp) throw 'Bqp not found';
    if (userParam.name) {
        if (bqp.name !== userParam.name &&  await Bqp.findOne({ name: userParam.name.toUpperCase() })) {
            throw 'Name "' + userParam.name + '" is already taken';
        } 
    }    
    // copy userParam properties to bqp
    Object.assign(bqp, userParam);
    await bqp.save();
}

async function _delete(id) {
    await Bqp.findByIdAndRemove(id);
}

async function getAllActive(id) {
    console.log('bqps getAllActive calling:')
    user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        // console.log('super_admin');
        return await Bqp.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
    }
    else if (user && user.role === 'ADMIN') {
        // console.log('admin');
        return await Bqp.find({ profileId: user.loginId, status: 'ACTIVE', }).sort({ name: 1 }).select('-_id name')
    }
    else if (user && user.role === 'LEAD') {
        // console.log('lead');
        return await Bqp.find({ profileId: user.profileId, status: 'ACTIVE', }).sort({ name: 1 }).select('-_id name')
    }   
    return await Bqp.find({ profileId: user.profileId, status: 'ACTIVE', }).sort({ name: 1 }).select('-_id name')
}

async function getAllByProfileId(id) {
    console.log('bqps getAllByProfileId calling:');

    user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        // console.log('super_admin');
        return await Bqp.find({status: 'ACTIVE'}).sort({ createdAt: -1 })
    }
    return await Bqp.find({ profileId: id, status: 'ACTIVE' }).sort({ createdAt: -1 })
}
