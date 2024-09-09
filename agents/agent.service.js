require('dotenv').config();
const db = require('_helpers/db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Agent = db.Agent;
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getAllActive,
    getByPospCode,
    getByRegCode,
    getAllByProfileId,
    getAllSalesman,
    getAllPosIssueDate,
};

async function authenticate({ email, password }) {
    const agent = await Agent.findOne({ posp_code: email, status: "ACTIVE" });
    // console.log(agent)  
    if (agent && bcrypt.compareSync(password, agent.hash)) {
        const token = jwt.sign({ sub: agent.id }, process.env.SECRET, { expiresIn: '7d' });
        return {
            ...agent.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await Agent.find().sort({ createdAt: -1 })
}

async function getById(id) {
    return await Agent.findById(id);
}

async function create(userParam) {
    // validate
    console.log(userParam);
    if (await Agent.findOne({ posp_code: userParam.posp_code.toUpperCase() })) {
        throw 'Agent POSP-Code "' + userParam.posp_code + '" is already taken';
    }
    if (await Agent.findOne({ registration_code: userParam.registration_code.toUpperCase() })) {
        throw 'Agent Reg-Code "' + userParam.registration_code + '" is already taken';
    }
    const agent = new Agent(userParam);
    // hash password
    if (userParam.password) {
        agent.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save Agent
    await agent.save();

}

async function update(id, userParam) {

    const agent = await Agent.findById(id);

    console.log(userParam);
    // validate
    if (!agent) throw 'Agent not found';

    // if (agent.posp_code !== userParam.posp_code && await Agent.findOne({ posp_code: userParam.posp_code })) {
    //     throw 'Posp Code "' + userParam.posp_code + '" is already taken';
    // }
    // if (agent.registration_code !== userParam.registration_code && await Agent.findOne({ registration_code: userParam.registration_code })) {
    //     throw 'Reg Code "' + userParam.registration_code + '" is already taken';
    // }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to agent
    Object.assign(agent, userParam);
    await agent.save();

    return agent
}

async function _delete(id) {
    await Agent.findByIdAndRemove(id);
}

async function getAllActive(id) {
    console.log('pos getAllActive: ');
    user = await User.findOne({ loginId: id });
    // console.log(user);

    if (user && user.role === 'SUPER_ADMIN') {
        console.log('super_admin');
        return await Agent.find({ status: 'ACTIVE' }).sort({ fullName: 1 }).select('-_id posp_code fullName salesman');
    }
    else if (user && user.role === 'ADMIN') {
        console.log('admin');
        return await Agent.find({ profileId: user.loginId, status: 'ACTIVE' }).sort({ fullName: 1 }).select('-_id posp_code fullName salesman');
    }
    else if (user && user.role === 'LEAD') {
        console.log('admin');
        return await Agent.find({ profileId: user.profileId, status: 'ACTIVE' }).sort({ fullName: 1 }).select('-_id posp_code fullName');
    }
    return await Agent.find({ profileId: user.loginId, status: 'ACTIVE' }).sort({ fullName: 1 }).select('-_id posp_code fullName');

}

async function getByPospCode(posp_code) {
    const exists = await Agent.findOne({ posp_code }).select('-_id posp_code');
    console.log(exists);
    if (exists) {
        return 'true';
    } else {
        return 'false';
    }
}

async function getByRegCode(registration_code) {
    const exists = await Agent.findOne({ registration_code }).select('-_id registration_code');
    console.log(exists);
    if (exists) {
        return 'true';
    } else {
        return 'false';
    }
}

async function getAllByProfileId(id) {
    
    console.log('agent getAllByProfileId method: ', id);
    return await Agent.find({ status: "ACTIVE" }).sort({ createdAt: -1 });

    // Find user & role
    let usr = await User.findOne({ loginId: id });
    // console.log(usr)
    if (usr && usr.role === 'SUPER_ADMIN')
        return await Agent.find({ status: "ACTIVE" }).sort({ createdAt: -1 });
    // return await Agent.find({ posp_code: { $exists: true }, status: "ACTIVE" }).sort({ createdAt: -1 });
    else if (usr && usr.role === 'ADMIN')
        return await Agent.find({ status: "ACTIVE" }).sort({ createdAt: -1 });
    // return await Agent.find({ profileId: usr.loginId }).sort({ createdAt: -1 });

    return await Agent.find({ status: "ACTIVE" }).sort({ createdAt: -1 })

    // user = await User.findOne({ loginId: id });
    // if (user && user.role === 'SUPER_ADMIN') {
    //     console.log('super_admin');
    //     return await Agent.find().sort({ createdAt: -1 })
    // }
    // return await Agent.find({ profileId: id }).sort({ createdAt: -1 })
}

async function getAllSalesman(id) {
    console.log('agents getAllSalesman calling: ');
    return await Agent.find({ status: 'ACTIVE' }).sort({ fullName: 1 }).select('-_id posp_code fullName bqp salesman slab');
}

async function updateField() {
    return
    console.log('update field calling:');
    // Call it like await updateField()
    // Use it carefully, as it can overwrite data

    // let agent = await Agent.find({ status: 'ACTIVE' });
    let agent = await Agent.find({ bqp: "SARITA RAWAT" });


    // Assuming you want to add a new field called 'newValue' with a specific value
    await agent.forEach(async function (agentDoc) {
        // agentDoc.bqp = 'SATVEER SINGH';
        // agentDoc.bqp = 'NEERAJ';

        // Save the modified document
        // await agentDoc.save();
    });


    console.log(agent);


}

async function getAllPosIssueDate(year) {
    console.log('getAllPosIssueDate calling:');

    console.log('selected year: ', year);

    // Assuming 'issue_date' is stored as a Date object in MongoDB
    const startDate = new Date(year, 0, 1); // Start of the specified year
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // End of the specified year

    return await Agent.find({ createdAt: { $gte: startDate, $lte: endDate } }).select('createdAt status')

    return await Policy.aggregate([
        {
            $match: {
                issue_date: { $gte: startDate, $lte: endDate } // Match documents with 'issue_date' within the specified year
            }
        },

        {
            $project: { issue_date: 1, status: 1 } // Select 'issue_date' and 'status' fields
        }
    ]);


    console.log('selected year: ', year);
    return await Policy.find().select('issue_date status')
}