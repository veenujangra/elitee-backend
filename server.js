require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
// const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const compression = require('compression');

// middlewares
app.use(compression({ level: 9 }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/agents', require('./agents/agent.controller'));
app.use('/insurers', require('./insurers/insurer.controller'));
app.use('/products', require('./products/product.controller'));
app.use('/gvws', require('./gvws/gvw.controller'));
app.use('/bqps', require('./bqps/bqp.controller'));
app.use('/salesmanagers', require('./salesManagers/salesman.controller'));
app.use('/vehicles', require('./vehicles/vehicle.controller'));
app.use('/policies', require('./policies/policy.controller'));
app.use('/claims', require('./claims/claim.controller'));
app.use('/payouts', require('./payouts/payout.controller'));
app.use('/ledgers', require('./ledgers/ledger.controller'));
app.use('/slabs', require('./slabs/slab.controller'));
app.use('/reports', require('./reports/report.controller'));
app.use('/payments', require('./payments/payment.controller'));


// This should be placed to their services but due to some lazy loading errors, are placed here
require('dotenv').config();
const db = require('_helpers/db');
const User = db.User;
const Agent = db.Agent;
const Insurer = db.Insurer;
const Product = db.Product;
const Policy = db.Policy;
const MotorClaim = db.MotorClaim;
const FireClaim = db.FireClaim;
const HealthClaim = db.HealthClaim;
const MarineClaim = db.MarineClaim;
const PosPayment = db.PosPayment;
const InsPayment = db.InsPayment;

app.get('/total-documents/:id', async (req, res) => {
    try {

        // Getting id from params
        console.log(req.params.id);

        // Find user & role
        let usr = await User.findOne({ loginId: req.params.id });
        console.log(usr)

        if (usr.status !== 'ACTIVE') {
            res.json({statusError: 'User is not active.'})
            return
        }

        let agent = await Agent.countDocuments({ status: 'ACTIVE' });
        let user = await User.countDocuments({ status: 'ACTIVE' });;
        let insurer = await Insurer.countDocuments({ status: "ACTIVE" });
        let product = await Product.countDocuments({ status: "ACTIVE" });
        let policy = 0;
        let motorClaim = 0;
        let fireClaim = 0;
        let healthClaim = 0;
        let marineClaim = 0;
        let processingPosPayment = 0;
        let processingInsPayment = 0;



        // If admin or user
        if (usr && usr.role === 'SUPER_ADMIN') {
            console.log('super admin block');
            policy = await Policy.countDocuments({ status: "ACTIVE" });
            pendingPolicy = await Policy.countDocuments({ status: 'PENDING' });
            motorClaim = await MotorClaim.countDocuments({ status: 'PENDING' });
            fireClaim = await FireClaim.countDocuments({ status: 'PENDING' });
            healthClaim = await HealthClaim.countDocuments({ status: 'PENDING' });
            marineClaim = await MarineClaim.countDocuments({ status: 'PENDING' });
            // processingPayment = await PosPayment.countDocuments({ status: 'PROCESSING' });
            processingPosPayment = await PosPayment.countDocuments({ status: 'PROCESSING' })
            processingInsPayment = await InsPayment.countDocuments({ status: 'PROCESSING' });

        }
        else if (usr && usr.role === 'MOD') {
            console.log('mod block');
            policy = await Policy.countDocuments({ status: "ACTIVE" });
            pendingPolicy = await Policy.countDocuments({ status: 'PENDING' });
            // motorClaim = await MotorClaim.countDocuments({ status: 'PENDING' });
            // fireClaim = await FireClaim.countDocuments({ status: 'PENDING' });
            // healthClaim = await HealthClaim.countDocuments({ status: 'PENDING' });
            // marineClaim = await MarineClaim.countDocuments({ status: 'PENDING' });

        }
        else if (usr && usr.role === 'ADMIN') {
            console.log('admin block');
            console.log(usr);
            policy = await Policy.countDocuments({ profileId: usr.loginId, status: "ACTIVE" });
            // pendingPolicy = await Policy.countDocuments({ profileId: usr.loginId, status: 'PENDING' });
            pendingPolicy = await Policy.countDocuments({
                $or: [
                    { profileId: usr.loginId },
                    { employee: usr.loginId }
                ],
                status: 'PENDING'
            });

            motorClaim = await MotorClaim.countDocuments({ status: 'PENDING', profileId: usr.loginId, });
            fireClaim = await FireClaim.countDocuments({ status: 'PENDING', profileId: usr.loginId, });
            healthClaim = await HealthClaim.countDocuments({ status: 'PENDING', profileId: usr.loginId, });
            marineClaim = await MarineClaim.countDocuments({ status: 'PENDING', profileId: usr.loginId, });

        }
        else if (usr && usr.role === 'LEAD') {
            console.log('user block');
            policy = await Policy.countDocuments({ employee: req.params.id, status: "ACTIVE" });
            pendingPolicy = null
        }

        // If pos
        if (usr === null) {
            console.log('pos block');
            policy = await Policy.countDocuments({ employee: req.params.id, status: "ACTIVE" });
            pendingPolicy = null
        }

        totalDocuments = {
            user: user,
            agent: agent,
            insurer: insurer,
            product: product,
            policy: policy,
            pendingPolicy: pendingPolicy,
            motorClaim,
            fireClaim,
            healthClaim,
            marineClaim,
            processingPosPayment,
            processingInsPayment,
        }

        res.json(totalDocuments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
