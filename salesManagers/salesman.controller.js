const express = require('express');
const router = express.Router();
const salesmanService = require('.//salesman.service');

// routes
router.post('/register', register);
router.get('/current', getCurrent);
router.get('/getAllActive/:id', getAllActive);
router.get('/getAllByBqp/:name', getAllByBqp);
router.get('/getAllByProfileId/:id', getAllByProfileId);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function register(req, res, next) {
    salesmanService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    salesmanService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    salesmanService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    salesmanService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    salesmanService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    salesmanService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllActive(req, res, next) {   
    salesmanService.getAllActive(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllByProfileId(req, res, next) {   
    salesmanService.getAllByProfileId(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAllByBqp(req, res, next) {   
    salesmanService.getAllByBqp(req.params.name)
        .then(users => res.json(users))
        .catch(err => next(err));
}