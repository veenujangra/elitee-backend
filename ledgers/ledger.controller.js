const express = require('express');
const router = express.Router();
const ledgerService = require('./ledger.service');

// routes
router.get('/agentPayable', getAgentPayable);
router.get('/insurerPayable', getInsurerPayable);
router.get('/getInsurerPayableFromRange/:range', getInsurerPayableFromRange);
router.get('/getAgentPayableFromRange/:range', getAgentPayableFromRange);
router.get('/employeePerformance', getEmployeePerformance);
router.get('/employeePerformanceFromRange/:range', getEmployeePerformanceFromRange);
router.get('/posAdvanceAmount/:range', getPospAdvanceAmountFromRange);
router.get('/getAllInsurerIssueDate/:year', getAllInsurerIssueDate);

router.use('/posAdvanceAmount', require('./advanceAmount/advanceAmount.controller'))

module.exports = router;


function getAgentPayable(req, res, next) {
    ledgerService.getAgentPayable()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getInsurerPayable(req, res, next) {     
    ledgerService.getInsurerPayable()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getInsurerPayableFromRange(req, res, next) {   
    year = Number(req.params.range.split('|')[0])
    month = Number(req.params.range.split('|')[1])
    ledgerService.getInsurerPayableFromRange(year, month)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAgentPayableFromRange(req, res, next) {   
    // console.log(req.params.range);
    frmDate = req.params.range.split('|')[0]
    toDate = req.params.range.split('|')[1]
    ledgerService.getAgentPayableFromRange(frmDate, toDate)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getEmployeePerformance(req, res, next) {
    ledgerService.getEmployeePerformance()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getEmployeePerformanceFromRange(req, res, next) {   
    year = Number(req.params.range.split('|')[0])
    month = Number(req.params.range.split('|')[1])
    ledgerService.getEmployeePerformanceFromRange(year, month)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getPospAdvanceAmountFromRange(req, res, next) {
    frmDate = req.params.range.split('|')[0]
    toDate = req.params.range.split('|')[1]
    // console.log(frmDate, ' ', toDate);
    ledgerService.getPospAdvanceAmountFromRange(frmDate, toDate)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllInsurerIssueDate(req, res, next) {
    ledgerService.getAllInsurerIssueDate(req.params.year)
        .then(users => res.json(users))
        .catch(err => next(err));
}