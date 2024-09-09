const express = require('express');
const router = express.Router();
const gvwService = require('./gvw.service');

// routes
router.post('/register', register);
router.get('/', getAll);
router.get('/getByInsurer/:insurers', getByInsurer);

router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function register(req, res, next) {
    gvwService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    gvwService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getByInsurer(req, res, next) {
    gvwService.getByInsurer(req.params.insurers)
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getCurrent(req, res, next) {
    gvwService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    gvwService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    gvwService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    gvwService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

