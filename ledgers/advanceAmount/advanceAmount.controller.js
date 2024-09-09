const express = require('express');
const router = express.Router();
const advanceAmountService = require('./advanceAmount.service');

// routes
// router.get('/agentPayable/:id', getAgentPayable);
// router.get('/insurerPayable/:id', getInsurerPayable);
// router.get('/getInsurerPayableFromRange/:id/:range', getInsurerPayableFromRange);
// router.get('/getAgentPayableFromRange/:id/:range', getAgentPayableFromRange);

router.post('/register', register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function register(req, res, next) {
    advanceAmountService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    advanceAmountService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    advanceAmountService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    advanceAmountService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    advanceAmountService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}