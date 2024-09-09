const express = require('express');
const router = express.Router();
const bqpService = require('./bqp.service');

// routes
router.post('/register', register);
router.get('/current', getCurrent);
router.get('/getAllActive/:id', getAllActive);
router.get('/getAllByProfileId/:id', getAllByProfileId);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function register(req, res, next) {
    bqpService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    bqpService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    bqpService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    bqpService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    bqpService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    bqpService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllActive(req, res, next) {   
    bqpService.getAllActive(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllByProfileId(req, res, next) {   
    bqpService.getAllByProfileId(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}