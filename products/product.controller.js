const express = require('express');
const router = express.Router();
const productService = require('./product.service');

// routes
router.post('/register', register);
router.get('/name/:name', getByName);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/getAllActive', getAllActive);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function register(req, res, next) {
    productService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    productService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    productService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    productService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    productService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    productService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllActive(req, res, next) {
    productService.getAllActive()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getByName(req, res, next) {  
    productService.getByName(req.params.name)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
