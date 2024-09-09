const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    profileId: { type: String,  },
    policy_no: { type: String },
    customer_name: { type: String },
    insurance_company: { type: String },
  
    hospital_state: { type: String },
    hospital_city: { type: String },
    hospital_name: { type: String },

    surveyor_name: { type: String },
    Claim_no_insured: { type: String },
    surveyor_ref_no: { type: String },
    loss_type: { type: String },
    estimate_amount: { type: String },
    settled_amount: { type: String },
 
    date_of_intimation: { type: String },
    date_of_loss: { type: String },      
    remark: { type: String },
 
    status: { type: String, default: 'ACTIVE'},
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

module.exports = mongoose.model('HealthClaim', schema);


