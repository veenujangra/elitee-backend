const express = require('express');
const router = express.Router();
const fireClaimService = require('./fire.service');

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
router.get('/getFromRange/:range', getFromRange);

module.exports = router;


function register(req, res, next) {
    fireClaimService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    fireClaimService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    fireClaimService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    fireClaimService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    fireClaimService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    fireClaimService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllActive(req, res, next) {
    fireClaimService.getAllActive()
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getByName(req, res, next) {
    console.log('getByInsurerName calling:');
    fireClaimService.getByName(req.params.name)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAllById(req, res, next) {
    fireClaimService.getAllById(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getPending(req, res, next) {
    fireClaimService.getPending(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getFromRange(req, res, next) {
    console.log('getFromRange calling');

    console.log(req.params.range);

    frmDate = req.params.range.split('|')[0]
    toDate = req.params.range.split('|')[1]

    fireClaimService.getFromRange(frmDate, toDate)
        .then(users => res.json(users))
        .catch(err => next(err));
}