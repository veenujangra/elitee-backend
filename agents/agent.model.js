const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    profileId: { type: String },
    // login_id: { type: String },
    loginId: {
        type: String,
        required: true,
        default: () => uuidv4().replace(/-/g, '').slice(0, 12) // Customize based on library options
    },
    profileImageUrl: { type: String, default: 'assets/images/experiya-logo.png' },
    posp_code: { type: String, required: true },
    registration_code: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    // branch: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    rural_urban: { type: String, required: true },
    slab: { type: String, required: true },
    bqp: { type: String, required: true },
    salesman: { type: String, },
    GSTIN: { type: String, required: true },
    pan_no: { type: String, required: true },
    aadhaar_no: { type: String, required: true },
  
    account_no: { type: String, required: true },
    ifsc_code: { type: String, required: true },
    bank_name: { type: String, required: true },
    appointment_date: { type: Date, required: true },
    termination_date: { type: Date, },    
    
    basic_qualification: { type: String },
    aadhar_card: { type: String, },
    pan_card: { type: String, },
    training_certificate: { type: String, },
    appointment_certificate: { type: String },
    agreement_certificate: { type: String, },
    bank_details: { type: String, },
    // password: { type: String },
    hash: { type: String },
    status: { type: String, default: 'ACTIVE' },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to trim & uppercase all fields except password
schema.pre('save', function (next) {
    const doc = this;
    const fieldsToExclude = ['hash', 'profileImageUrl', 'basic_qualification', 'pan_card', 'aadhar_card', 'training_certificate', 'appointment_certificate', 'agreement_certificate', 'bank_details'];
    const schemaKeys = Object.keys(schema.paths);
    schemaKeys.forEach(key => {
        if (!fieldsToExclude.includes(key) && schema.paths[key].instance === 'String')
            if (doc[key])
                doc[key] = doc[key].trim().toUpperCase();
    });
    doc.email = doc.email.trim().toLowerCase();

    next();
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Agent', schema);