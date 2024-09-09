const db = require('_helpers/db');
const Agent = db.Agent;
const Policy = db.Policy;
const AdvanceAmount = db.AdvanceAmount;
const Insurer = db.Insurer;
const Salesman = db.Salesman;


module.exports = {
    getAgentPayable,
    getAgentPayableFromRange,
    getInsurerPayable,
    getInsurerPayableFromRange,
    getEmployeePerformance,
    getEmployeePerformanceFromRange,
    getPospAdvanceAmountFromRange,
    getAllInsurerIssueDate,
};

async function getAgentPayable() {
    console.log('getAgentPayable calling:');
    const { startDate, endDate } = getCurrentMonthDates();
    agents = null
    policies = null
    amountList = null
    agents = await Agent.find({ status: "ACTIVE" }).select('-_id  posp_code')
    policies = await Policy.find({ issue_date: { $gte: startDate, $lte: endDate }, status: 'ACTIVE', pos_od: { $ne: null } }).select('pos pos_od pos_tp');
    amountList = await AdvanceAmount.find();
    // console.log(agents);
    return { agents, policies, amountList }
}

async function getAgentPayableFromRange(startDate, endDate) {
    console.log('getAgentPayableFromRange calling:');
    console.log(startDate, '  ', endDate);
    agents = null
    policies = null
    amountList = null
    agents = await Agent.find({ status: "ACTIVE" }).select('-_id  posp_code')
    policies = await Policy.find({
        status: 'ACTIVE',
        issue_date: { $gte: startDate, $lte: endDate },
        pos_od: { $ne: null }
    }).select('pos pos_od pos_tp');

    amountList = await AdvanceAmount.find();
    console.log(policies);
    return { agents, policies, amountList }
}

async function getInsurerPayable() {
    console.log('getInsurerPayable calling:');
    const { startDate, endDate } = getCurrentMonthDates();
    insurers = null
    policies = null
    insurers = await Insurer.find({ status: "ACTIVE" }).select('-_id  name')
    policies = await Policy.find({
        status: 'ACTIVE',
        issue_date: { $gte: startDate, $lte: endDate },
        pos_od: { $ne: null }
    }).select('insurance_company pos_od pos_tp actualA actualB actualC');
    return { insurers, policies }
}

async function getInsurerPayableFromRange(year, month) {
    console.log('getInsurerPayableFromRange calling:');
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
    }).select('insurance_company experiya_od_commission experiya_tp_commission experiya_od_reward experiya_tp_reward actualA actualB actualC');

    return { insurers, policies }
}

async function getEmployeePerformance() {
    console.log('Ledger getEmployeePerformance calling:');
    const { startDate, endDate } = getCurrentMonthDates();
    const { y1, y2 } = getCurrentYearDates(startDate);
    console.log(startDate, endDate);
    // console.log(y1);
    // console.log(y2);

    sm = await Salesman.find({ status: "ACTIVE" }).select('name bqp')
    policies = await Policy.find({ issue_date: { $gte: startDate, $lte: endDate }, status: 'ACTIVE' }).select('vehicle_catagory risk_start_date salesman net');
    agents = await Agent.find({ createdAt: { $gte: startDate, $lte: endDate }, status: 'ACTIVE', }).select('salesman createdAt');
    ytdAgents = await Agent.find({ createdAt: { $gte: y1, $lte: y2 }, status: 'ACTIVE' }).select('salesman createdAt');
    return { sm, agents, policies, ytdAgents }
}

async function getEmployeePerformanceFromRange(year, month) {
    console.log('Ledger getEmployeePerformanceFromRange calling:');

    console.log(year, '  ', month);
   
    sm = await Salesman.find({ $expr: { $eq: [{ $year: "$createdAt" }, year] }, status: 'ACTIVE' }).select('name bqp')
   
    // policies = await Policy.find({ $expr: { $eq: [{ $year: "$createdAt" }, year] }, status: 'ACTIVE' }).select('vehicle_catagory salesman net');
    policies = await Policy.find({ $expr: { $eq: [{ $year: "$issue_date" }, year] }, status: 'ACTIVE' }).select('vehicle_catagory salesman net');

    agents = await Agent.find({ $expr: { $eq: [{ $year: "$createdAt" }, year] }, status: 'ACTIVE' }).select('salesman createdAt')

    // console.log('agents ', agents);
    // console.log('ytdAgents ', ytdAgents);

    return { sm, agents,  policies, }
}

function getCurrentMonthDates() {
    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Months are zero-indexed
    const currentDay = currentDate.getDate();

    // Set the start date to the first day of the current month
    const startDate = new Date(Date.UTC(currentYear, currentMonth, 1));

    // Set the end date to the current day of the current month
    const endDate = new Date(Date.UTC(currentYear, currentMonth, currentDay));

    // console.log(startDate);
    // console.log(endDate);

    return { startDate, endDate }
}

function getCurrentYearDates(startDate = null) {

    if (!startDate) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const y1 = new Date(Date.UTC(currentYear, 0, 1));
        const y2 = new Date(Date.UTC(currentYear, 12, 0));
        return { y1, y2 }
    }
    else {
        const currentDate = new Date(startDate);
        const currentYear = currentDate.getFullYear();
        const y1 = new Date(Date.UTC(currentYear, 0, 1));
        const y2 = new Date(Date.UTC(currentYear, 12, 0));
        return { y1, y2 }
    }
}

async function getPospAdvanceAmountFromRange(startDate, endDate) {
    console.log('ledger getPospAdvanceAmountFromRange:');
    // console.log(startDate, ' ', endDate);
    if (startDate == 'null') {
        return await AdvanceAmount.find().limit(50).sort({ createdAt: -1 })
    }
    return await AdvanceAmount.find({ createdAt: { $gte: startDate, $lte: endDate } }).sort({ createdAt: -1 })
}

async function getAllInsurerIssueDate(year) {
    console.log('getAllInsurerIssueDate calling:');

    console.log('selected year: ', year);

    // Assuming 'issue_date' is stored as a Date object in MongoDB
    let startDate = new Date(year, 0, 1); // Start of the specified year
    let endDate = new Date(year, 11, 31, 23, 59, 59, 999); // End of the specified year
    console.log(startDate);
    console.log(endDate);
    insurers = await Insurer.find({ status: "ACTIVE" }).select('-_id  name')       

    policies = await Policy.find({ issue_date: { $gte: startDate, $lte: endDate } }).
    select('customer_name issue_date insurance_company experiya_od_commission experiya_tp_commission experiya_od_reward experiya_tp_reward actualA actualB actualC');

    return { insurers, policies }

}