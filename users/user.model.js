const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    profileId: { type: String },
    loginId: {
        type: String,
        required: true,
        default: () => uuidv4().replace(/-/g, '').slice(0, 10) // Customize based on library options
    },
    firstName: { type: String, },
    lastName: { type: String },
    fullName: { type: String },
    hash: { type: String },
    mobileNumber: { type: String, unique: true },
    email: { type: String },
    profileImageUrl: { type: String, default: 'assets/images/experiya-logo.png' },
    role: { type: String, default: 'LEAD' },
    status: { type: String, default: 'ACTIVE' },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to uppercase all fields except password
schema.pre('save', function (next) {
    const doc = this;
    const fieldsToExclude = ['hash', 'profileImageUrl'];
    const schemaKeys = Object.keys(schema.paths);
    schemaKeys.forEach(key => {
        if (!fieldsToExclude.includes(key) && schema.paths[key].instance === 'String')
            if (doc[key])
                doc[key] = doc[key].trim().toUpperCase();
    });
    if (doc.email)
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

module.exports = mongoose.model('User', schema);