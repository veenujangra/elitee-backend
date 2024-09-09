const express = require('express');
const router = express.Router();
const motorClaimService = require('./motor.service');

// routes
router.post('/register', register);
router.get('/name/:name', getByName);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/getAllActive', getAllActive);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.get('/getAllById/:id', getAllById);
router.get('/getPending/:id', getPending);

module.exports = router;


function register(req, res, next) {
    motorClaimService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    motorClaimService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    motorClaimService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    motorClaimService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    motorClaimService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    motorClaimService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllActive(req, res, next) {
    motorClaimService.getAllActive()
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getByName(req, res, next) {
    console.log('getByInsurerName calling:');
    motorClaimService.getByName(req.params.name)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAllById(req, res, next) {
    motorClaimService.getAllById(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getPending(req, res, next) {
    motorClaimService.getPending(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}