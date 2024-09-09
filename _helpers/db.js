require('dotenv').config();

const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || process.env.CONNECTION_STRING, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Policy: require('../policies/policy.model'),
    Agent: require('../agents/agent.model'),
    Insurer: require('../insurers/insurer.model'),
    Product: require('../products/product.model'),
    Payout: require('../payouts/payout.model'),
    Gvw: require('../gvws/gvw.model'),
    Category: require('../vehicles/categories/category.model'),
    Make: require('../vehicles/makes/make.model'),
    Model: require('../vehicles/models/model.model'),
    Bqp: require('../bqps/bqp.model'),
    Ledger: require('../ledgers/ledger.model'),
    Salesman: require('../salesManagers/salesman.model'),
    AdvanceAmount: require('../ledgers/advanceAmount/advanceAmount.model'),
    FireClaim: require('../claims/fire/fire.model'),
    HealthClaim: require('../claims/health/health.model'),
    MarineClaim: require('../claims/marine/marine.model'),
    MotorClaim: require('../claims/motor/motor.model'),
    Slab: require('../slabs/slab.model'),
    PosPayment: require('../payments/pos/posPayment.model'),
    InsPayment: require('../payments/insurer/insPayment.model'),
   
    
};