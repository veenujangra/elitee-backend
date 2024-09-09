require('dotenv').config();
const express = require('express');
const router = express.Router();
const payoutService = require('./payout.service');

// routes
router.post('/register', register);
router.post('/registerMany', registerMany);
router.get('/', getAll);
router.get('/getAllBySlab/:id', getAllBySlab);
router.get('/getAllActiveEndDate', getAllActiveEndDate);
router.get('/getAllFromDate/:date', getAllFromDate);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function register(req, res, next) {
    payoutService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function registerMany(req, res, next) {
    payoutService.createMany(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    payoutService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllActiveEndDate(req, res, next) {
    payoutService.getAllActiveEndDate()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllFromDate(req, res, next) {
    payoutService.getAllFromDate()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    payoutService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    payoutService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    payoutService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    payoutService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllBySlab(req, res, next) {
    payoutService.getAllBySlab(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}