const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    posp_code: { type: String, },
    fullName: { type: String, },
    pan_no: { type: String, },
    aadhaar_no: { type: String, },
    account_no: { type: String, },
    totalPolicy: { type: String, },
    netPremium: { type: String, },
    totalCommission: { type: String, },
    tdsAmount: { type: String, },
    netPayable: { type: String, },
    appointment_date: { type: String, },
    termination_date: { type: String, },
    policyIdList: { type: Array, },   

    status: { type: String, default: "PROCESSING" },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to convert data to uppercase
schema.pre('save', function (next) {
    const doc = this;
    const fieldsToExclude = [];
    const schemaKeys = Object.keys(schema.paths);
    schemaKeys.forEach(key => {
        if (!fieldsToExclude.includes(key) && schema.paths[key].instance === 'String')
            if (doc[key])
                doc[key] = doc[key].trim().toUpperCase();
    });
    next();
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('PosPayment', schema);


