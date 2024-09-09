const express = require('express');
const router = express.Router();
const insurerService = require('./posPayment.service');

// routes
router.post('/register', register);
router.post('/registerMany', registerMany);
router.post('/deletePayments', deletePayments);

router.post('/setStatusToReadOnly', setStatusToReadOnly);
router.post('/setStatusToActive', setStatusToActive);
router.get('/getAllProcessing', getAllProcessing);
router.get('/getAllDone/:year/:period', getAllDone);
router.get('/list/:ids', getByIds);
router.get('/deleteMany/:ids', deleteMany);

router.get('/name/:name', getByName);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/getAllActive', getAllActive);
router.get('/:id', getById);
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

function registerMany(req, res, next) {
    insurerService.createMany(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllProcessing(req, res, next) {  
    insurerService.getAllProcessing()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllDone(req, res, next) {  
    year = req.params.year
    period = req.params.period
    insurerService.getAllDone(year, period)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function setStatusToReadOnly(req, res, next) {   
    insurerService.setStatusToReadOnly(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function setStatusToActive(req, res, next) {   
    insurerService.setStatusToActive(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getByIds(req, res, next) {
    insurerService.getByIds(req.params.ids)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function deleteMany(req, res, next) {
    insurerService.deleteMany(req.params.ids)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function deletePayments(req, res, next) {
    insurerService.deletePayments(req.body)
        .then(users => res.json(users))
        .catch(err => next(err));
}