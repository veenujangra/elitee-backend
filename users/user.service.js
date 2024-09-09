require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByEmail,
    getAllByProfileId,
    getAllUsersIssueDate,
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    if (user && user.status === 'ACTIVE' && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, process.env.SECRET, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find({ status: "ACTIVE" }).sort({ createdAt: -1 })
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    console.log('hello', userParam);
    if (await User.findOne({ fullName: userParam.fullName })) {
        throw 'Full Name "' + userParam.fullName + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    console.log('USER update method calling:');
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Email ID "' + userParam.email + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();

    // Return the updated document
    return user;
}


async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function getByEmail(email) {
    const exists = await User.findOne({ email }).select('-_id email');
    console.log(exists);
    if (exists) {
        return 'true';
    } else {
        return 'false';
    }
}

async function getAllByProfileId(id) {
    console.log('users getAllByProfileId calling: ');
    let usr = await User.findOne({ loginId: id });
    // console.log(usr)
    if (usr && usr.role === 'SUPER_ADMIN')
        return await User.find({ status: 'ACTIVE' }).sort({ createdAt: -1 })
    else if (usr && usr.role === 'ADMIN')
        return await User.find({ profileId: usr.loginId, status: "ACTIVE" }).sort({ createdAt: -1 });

}

async function getAllUsersIssueDate(year) {
    console.log('getAllUsersIssueDate calling:');

    console.log('selected year: ', year);

    // Assuming 'issue_date' is stored as a Date object in MongoDB
    const startDate = new Date(year, 0, 1); // Start of the specified year
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // End of the specified year

    return await User.find({ createdAt: { $gte: startDate, $lte: endDate } }).select('createdAt status')

}