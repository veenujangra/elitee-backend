const express = require('express');
const router = express.Router();
const agentService = require('./agent.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/getAllActive/:id', getAllActive);
router.get('/getAllSalesman', getAllSalesman);
router.get('/getAllByProfileId/:id', getAllByProfileId);
router.get('/posp_code/:posp_code', getByPospCode);
router.get('/registration_code/:registration_code', getByRegCode);
router.get('/getAllPosIssueDate/:year', getAllPosIssueDate);

router.get('/',  getAll);
router.get('/current',  getCurrent);
router.get('/:id',  getById);
router.put('/:id',  update);
router.delete('/:id',  _delete);

module.exports = router;

function authenticate(req, res, next) {
    agentService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    agentService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    console.log('object');
    agentService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    agentService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    agentService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    agentService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    agentService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllActive(req, res, next) {  
    agentService.getAllActive(req.params.id)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getByPospCode(req, res, next) {  
    agentService.getByPospCode(req.params.posp_code)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByRegCode(req, res, next) {   
    agentService.getByRegCode(req.params.registration_code)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAllByProfileId(req, res, next) {   
    agentService.getAllByProfileId(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAllSalesman(req, res, next) {  
    agentService.getAllSalesman()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAllPosIssueDate(req, res, next) {
    agentService.getAllPosIssueDate(req.params.year)
        .then(users => res.json(users))
        .catch(err => next(err));
}