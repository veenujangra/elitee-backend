const db = require('_helpers/db');
const FireClaim = db.FireClaim;
const User = db.User;
const utils = require('_helpers/utils');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
    getAllById,
    getPending,
    getFromRange,

};


async function getAll() {
    console.log('motor claim getAll: ');
    return await FireClaim.find().sort({ createdAt: -1 });
}

async function getById(id) {
    return await FireClaim.findById(id);
}

async function create(userParam) {
    // if (await FireClaim.findOne({ name: userParam.name.toUpperCase() })) {
    //     throw 'Name "' + userParam.name + '" is already taken';
    // }
    const fireClaim = new FireClaim(userParam);
    await fireClaim.save();
}

async function update(id, userParam) {
    const fireClaim = await FireClaim.findById(id);
    if (!fireClaim) throw 'Motor claim not found';
    // if (await FireClaim.findOne({ name: userParam.name.toUpperCase() })) {
    //     throw 'Name "' + userParam.name + '" is already taken';
    // }
    // copy userParam properties to FireClaim
    Object.assign(fireClaim, userParam);
    await fireClaim.save();
}

async function _delete(id) {
    await FireClaim.findByIdAndRemove(id);
}

async function getAllActive() {
    return await FireClaim.find({ status: 'ACTIVE' }).sort({ name: 1 }).select('-_id name')
}

async function getAllById(id) {
    console.log('fire claim getAllById calling: ');
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        return await FireClaim.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
    else if (user && user.role === 'ADMIN') {
        return await FireClaim.find({ profileId: user.loginId, status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }

}

async function getPending(id) {
    console.log('fire claim getPending claiming ');
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        return await FireClaim.find({ status: 'PENDING' }).sort({ createdAt: -1 })
    }
    else if (user && user.role === 'ADMIN') {
        return await FireClaim.find({ profileId: user.loginId, status: 'PENDING' }).sort({ createdAt: -1 })
    }
}

async function getFromRange(frmDate, toDate) {
    console.log('fire getFromRange calling:');
    const dateQuery = utils.dateRangeQuery(frmDate, toDate);
    // console.log(dateQuery);
    return await FireClaim.find({ "createdAt": dateQuery });
}

