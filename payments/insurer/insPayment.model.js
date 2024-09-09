const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;
const schema = new Schema({
 
    uuid: {
        type: String,
        required: true,
        default: () => uuidv4().replace(/-/g, '').slice(0, 5) 
    },

    name: { type: String, },    

    totalPolicy: { type: String, },

    totalCommission: { type: String, },

    actualTotal: { type: String, },

    invoiceA: { type: String, },
    invoiceB: { type: String, },
    invoiceC: { type: String, },   
   
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

module.exports = mongoose.model('InsPayment', schema);


