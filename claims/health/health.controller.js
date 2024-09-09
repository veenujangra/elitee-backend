const express = require('express');
const router = express.Router();
const healthClaimService = require('./health.service');

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
    healthClaimService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    healthClaimService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    healthClaimService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    healthClaimService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    healthClaimService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    healthClaimService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllActive(req, res, next) {
    healthClaimService.getAllActive()
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getByName(req, res, next) {
    console.log('getByInsurerName calling:');
    healthClaimService.getByName(req.params.name)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAllById(req, res, next) {
    healthClaimService.getAllById(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getPending(req, res, next) {
    healthClaimService.getPending(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}