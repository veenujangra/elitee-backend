require('dotenv').config();
const expressJwt = require('express-jwt');
const userService = require('../users/user.service');
const agentService = require('../agents/agent.service');

module.exports = jwt;

function jwt() {
    const secret = process.env.SECRET;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/agents/authenticate',
            '/agents/register',
        ]
    });
}

async function isRevoked(req, payload, done) {

    // console.log('isRevoked calling:');
    // console.log(payload);
    // console.log(req.originalUrl);

    let user = await userService.getById(payload.sub);

    if (!user) {
        user = await agentService.getById(payload.sub);
    }

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}