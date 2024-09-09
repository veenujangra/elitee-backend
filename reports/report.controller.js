const express = require('express');
const router = express.Router();
const insurerService = require('./report.service');

// routes
router.post('/register', register);
router.get('/name/:name', getByName);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/getAllActive', getAllActive);
router.get('/:id', getById);
router.get('/getReportFromPeriod/:year/:period', getReportFromPeriod);
router.get('/getInsurerReportFromPeriod/:year/:period', getInsurerReportFromPeriod);

router.get('/getPosSummaryFromPeriod/:year/:period', getPosSummaryFromPeriod);
router.post('/setPolicyStatusToReadOnly', setPolicyStatusToReadOnly);
router.post('/setPolicyStatusToProcessing', setPolicyStatusToProcessing);


router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function register(req, res, next) {
    insurerService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    insurerService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    insurerService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    insurerService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    insurerService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    insurerService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllActive(req, res, next) {
    insurerService.getAllActive()
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getByName(req, res, next) {
    console.log('getByInsurerName calling:');
    insurerService.getByName(req.params.name)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getReportFromPeriod(req, res, next) {
    year = req.params.year
    period = req.params.period
    insurerService.getReportFromPeriod(year, period)
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getInsurerReportFromPeriod(req, res, next) {
    year = req.params.year
    period = req.params.period
    insurerService.getInsurerReportFromPeriod(year, period)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getPosSummaryFromPeriod(req, res, next) {
    year = req.params.year
    period = req.params.period
    // console.log(year, period);
    insurerService.getPosSummaryFromPeriod(year, period)
        .then(users => res.json(users))
        .catch(err => next(err));
}


function setPolicyStatusToProcessing(req, res, next) {   
    insurerService.setPolicyStatusToProcessing(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function setPolicyStatusToReadOnly(req, res, next) {   
    insurerService.setPolicyStatusToReadOnly(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}


