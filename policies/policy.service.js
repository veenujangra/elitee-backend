require('dotenv').config();
const db = require('_helpers/db');
const Policy = db.Policy;
const User = db.User;
const Agent = db.Agent;


module.exports = {
    getAll,
    getById,
    create,
    update,
    updateByField,
    delete: _delete,
    getFromRange,
    getAllById,
    getPending,
    getByProposalNumber,
    getByPolicyNumber,
    getByRegNumber,
    findPolicyNumber,
    findByPreviousPolicyNumber,
    getByIds,
    getAllPolicyIssueDate,
    getAllPolicyCommission,
    findRegNumber,
    getAllProcessing,
    getAllReadOnly,
    findPolicyByStatus,


};


async function getAll() {
    return await Policy.find().sort({ createdAt: -1 }).limit(50)
}

async function getAllById(id) {
    console.log('policies getAllById calling: =====');

    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        // return await Policy.find({ status: 'ACTIVE' }).sort({ issue_date: -1 }).limit(25)
        return await Policy.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
    else if (user && user.role === 'ADMIN') {
        return await Policy.find({ $or: [{ profileId: user.loginId }, { employee: user.loginId }], status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
    else if (user && user.role === 'LEAD') {
        return await Policy.find({ employee: user.loginId, status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
    else if (user && user.role === 'MOD') {
        return await Policy.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
    }
    return await Policy.find({ employee: id, status: 'ACTIVE' }).sort({ createdAt: -1 }).limit(25)
}

async function getPending(id) {
    console.log('policies getPending calling:');
    let user = await User.findOne({ loginId: id });
    if (user && user.role === 'SUPER_ADMIN') {
        return await Policy.find({ status: 'PENDING' }).sort({ createdAt: -1 })
    }
    else if (user && user.role === 'MOD') {
        return await Policy.find({ status: 'PENDING' }).sort({ createdAt: -1 })
    }
    else if (user && user.role === 'ADMIN') {
        return await Policy.find({
            $or: [{ profileId: user.loginId }, { employee: user.loginId }], status: 'PENDING'
        }).sort({ createdAt: -1 })
    }
}

async function getById(id) {
    return await Policy.findById(id);
}

async function create(policyParam) {
    const policy = new Policy(policyParam);
    // save Policy
    await policy.save();
}

async function update(id, userParam) {
    console.log('policy update calling:');
    // console.log(userParam);
    const policy = await Policy.findById(id);
    if (!policy) throw 'Policy not found';
    // copy userParam properties to Policy
    Object.assign(policy, userParam);
    await policy.save();
}

async function updateByField(id, userParam) {
    console.log('policy updateByField calling:');
    console.log(userParam);
    const policy = await Policy.findById(id);
    if (!policy) throw 'Policy not found';
    // copy userParam properties to Policy
    Object.assign(policy, userParam);
    await policy.save();
}


async function _delete(id) {
    await Policy.findByIdAndRemove(id);
}

async function getFromRange_old(id, frmDate, toDate) {
    console.log('policies getFromRange calling:');

    // console.log(id);
    let dt1 = frmDate.toString().split(' ')[0]
    let dt2 = toDate.toString().split(' ')[0]
    // console.log(dt1);
    // console.log(dt2);
    let user = await User.findOne({ loginId: id });
    // console.log(user);
    if (user && user.role === 'SUPER_ADMIN') {
        // return await Policy.find({ issue_date: { $gte: dt1, $lte: dt2 }, status: 'ACTIVE' }).sort({ issue_date: -1 })
        return await Policy.find({
            $or: [
                { issue_date: { $gte: dt1, $lte: dt2 } },
                { endorsement_issue_date: { $gte: dt1, $lte: dt2 } }
            ],
            status: 'ACTIVE'
        }).sort({ issue_date: -1 });

    }
    else if (user && user.role === 'MOD') {
        return await Policy.find({
            $or: [
                { issue_date: { $gte: dt1, $lte: dt2 } },
                { endorsement_issue_date: { $gte: dt1, $lte: dt2 } }
            ],
            status: 'ACTIVE'
        }).sort({ issue_date: -1 });

    }
    else if (user && user.role === 'ADMIN') {
        return await Policy.find({
            $or: [
                { issue_date: { $gte: dt1, $lte: dt2 } },
                { endorsement_issue_date: { $gte: dt1, $lte: dt2 } }
            ], profileId: user.loginId, status: 'ACTIVE'
        }).sort({ issue_date: -1 });

        return await Policy.find({ issue_date: { $gte: dt1, $lte: dt2 }, profileId: user.loginId, status: 'ACTIVE' }).sort({ issue_date: -1 })
    }
    else if (user && user.role === 'LEAD') {
        return await Policy.find({
            $or: [
                { issue_date: { $gte: dt1, $lte: dt2 } },
                { endorsement_issue_date: { $gte: dt1, $lte: dt2 } }
            ], employee: user.loginId, status: 'ACTIVE'
        }).sort({ issue_date: -1 });

        return await Policy.find({ issue_date: { $gte: dt1, $lte: dt2 }, employee: user.loginId, status: 'ACTIVE' }).sort({ issue_date: -1 })
    }

    return await Policy.find({
        $or: [
            { issue_date: { $gte: dt1, $lte: dt2 } },
            { endorsement_issue_date: { $gte: dt1, $lte: dt2 } }
        ], employee: id, status: 'ACTIVE'
    }).sort({ issue_date: -1 });

    return await Policy.find({ issue_date: { $gte: dt1, $lte: dt2 }, employee: id, status: 'ACTIVE' }).sort({ issue_date: -1 })

}

async function getFromRange(id, frmDate, toDate) {
    console.log('policies getFromRange calling:');

    // console.log(id);
    let dt1 = frmDate.toString().split(' ')[0]
    let dt2 = toDate.toString().split(' ')[0]
    // console.log(dt1);
    // console.log(dt2);
    let user = await User.findOne({ loginId: id });
    // console.log(user);

    let query = { status: 'ACTIVE' };

    if (dt1 && dt2) {
        query.$or = [
            {
                endorsement_issue_date: { $gte: dt1, $lte: dt2 }
            },
            {
                endorsement_issue_date: null,
                issue_date: { $gte: dt1, $lte: dt2 }
            }
        ];
    }

    if (user && (user.role === 'SUPER_ADMIN' || user.role === 'MOD')) {

        return await Policy.find(query).sort({ issue_date: -1 });


    }    
    else if (user && user.role === 'ADMIN') {

        return await Policy.find({profileId: user.loginId}).find(query).sort({ issue_date: -1 });

        // return await Policy.find({
        //     $or: [
        //         { issue_date: { $gte: dt1, $lte: dt2 } },
        //         { endorsement_issue_date: { $gte: dt1, $lte: dt2 } }
        //     ], profileId: user.loginId, status: 'ACTIVE'
        // }).sort({ issue_date: -1 });

        // return await Policy.find({ issue_date: { $gte: dt1, $lte: dt2 }, profileId: user.loginId, status: 'ACTIVE' }).sort({ issue_date: -1 })
   
   
   
    }
    else if (user && user.role === 'LEAD') {

        return await Policy.find({employee: user.loginId}).find(query).sort({ issue_date: -1 });

        // return await Policy.find({
        //     $or: [
        //         { issue_date: { $gte: dt1, $lte: dt2 } },
        //         { endorsement_issue_date: { $gte: dt1, $lte: dt2 } }
        //     ], employee: user.loginId, status: 'ACTIVE'
        // }).sort({ issue_date: -1 });

        // return await Policy.find({ issue_date: { $gte: dt1, $lte: dt2 }, employee: user.loginId, status: 'ACTIVE' }).sort({ issue_date: -1 })

    }

    return await Policy.find({employee: user.loginId}).find(query).sort({ issue_date: -1 });

}

async function getByProposalNumber(proposal_no) {
    // return await Policy.findOne({ proposal_no});

    const existingPolicy = await Policy.findOne({ proposal_no, status: 'ACTIVE' }).select('-_id proposal_no');
    console.log(existingPolicy);
    if (existingPolicy) {
        return 'true';
    } else {
        return 'false';
    }
}

async function getByPolicyNumber(policy_no) {

    const existingPolicy = await Policy.findOne({ policy_no, status: 'ACTIVE' }).select('-_id policy_no');
    console.log(existingPolicy);
    if (existingPolicy) {
        return 'true';
    } else {
        return 'false';
    }
}

async function getByRegNumber(registration_no) {

    const existingPolicy = await Policy.findOne({ registration_no, status: 'ACTIVE' }).select('-_id registration_no');
    console.log(existingPolicy);
    if (existingPolicy) {
        return 'true';
    } else {
        return 'false';
    }
}

async function findPolicyNumber(policy_no) {
    console.log('policy findPolicyNumber calling:');
    return await Policy.find({ $or: [{ policy_no }, { endorsement_no: policy_no }], }).sort({ createdAt: -1 });
}

async function findPolicyByStatus(status) {
    console.log('policy findPolicyByStatus calling:');
    if (status === 'NULL')
        return await Policy.find({ status: null }).sort({ createdAt: -1 });
    return await Policy.find({ status: status }).sort({ createdAt: -1 });
}

async function findByPreviousPolicyNumber(previous_policy_no) {
    console.log('policy findByPreviousPolicyNumber calling:');
    return await Policy.find({ policy_no: previous_policy_no, }).sort({ createdAt: -1 });
}

async function findRegNumber(reg_no) {
    console.log('policy findRegNumber calling:');
    return await Policy.findOne({ registration_no, status: 'ACTIVE' });
}

async function getByIds(ids) {
    const idArray = ids.split(',');
    return await Policy.find({ _id: { $in: idArray }, });
}

async function getAllPolicyIssueDate(year) {

    console.log('selected year: ', year);

    // Assuming 'issue_date' is stored as a Date object in MongoDB
    const startDate = new Date(year, 0, 1); // Start of the specified year
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // End of the specified year

    // We can also find using below year query.
    // As we aggregate the above query.
    // $expr: {
    //     $eq: [{ $year: "$issue_date" }, Number.parseInt(year)]
    //   }

    let query = { status: 'ACTIVE' };

    if (startDate && endDate) {
        query.$or = [
            {
                endorsement_issue_date: { $gte: startDate, $lte: endDate }
            },
            {
                endorsement_issue_date: null,
                issue_date: { $gte: startDate, $lte: endDate }
            }
        ];
    }
    
    return await Policy.find(query).sort({ issue_date: -1 });

    return await Policy.find({
        $or: [
            { issue_date: { $gte: startDate, $lte: endDate } },
            { endorsement_issue_date: { $gte: startDate, $lte: endDate } }
        ],
    }).select('issue_date status')

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

async function getAllPolicyCommission(year) {

    console.log('policy getAllPolicyCommission calling:');

    // return await Policy.find().select('issue_date status')

    console.log(year, '  ', month);

    insurers = null
    policies = null
    insurers = await Insurer.find({ status: "ACTIVE" }).select('-_id  name')

    policies = await Policy.find({
        $expr: {
            $and: [
                { $eq: [{ $year: "$issue_date" }, year] },
                { $eq: [{ $month: "$issue_date" }, month] }
            ]
        },
        status: 'ACTIVE'
    }).select('insurance_company pos_od pos_tp actualA actualB actualC');

    return { insurers, policies }
}

async function updateField() {
    // This function is used for updating/creating new field
    // Use it carefully

    // return
    console.log('update field calling:');
    // Call it like await updateField()
    // Use it carefully, as it can overwrite data

    let agent = await Policy.find({ status: 'ACTIVE' });

    count = 0;

    await agent.forEach(async function (agentDoc) {
        if (agentDoc.endorsement_no) {
            console.log(agentDoc.endorsement_no);
            count++;
            agentDoc.endorsement_no = '';
            // await agentDoc.save();
        }


    });


    console.log(count);

}


async function getAllProcessing() {
    console.log('policies getAllProcessing calling: ');
    return await Policy.find({ status: "PROCESSING" }).sort({ createdAt: -1 })
}

async function getAllReadOnly() {
    console.log('policies getAllReadOnly calling: ');
    return await Policy.find({ status: "READ_ONLY" }).sort({ createdAt: -1 })
}
