const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    profileId: { type: String },
    proposal_no: { type: String },
    policy_no: { type: String },
    previous_policy_no : {type: String},
    endorsement_no: { type: String },

    customer_name: { type: String },
    previousInsurer: {type: String},
    insurance_company: { type: String },
    sp_name: { type: String },
    sp_brokercode: { type: String },
    product_name: { type: String },
    registration_no: { type: String },
    rto_state: { type: String },
    rto_city: { type: String },
    vehicle_makeby: { type: String },
    vehicle_model: { type: String },
    vehicle_catagory: { type: String },
    vehicle_fuel_type: { type: String },
    mfg_year: { type: String },
    isHighend: { type: String },
    addon: { type: String },
    ncb: { type: String },
    cubic_capacity: { type: String },
    gvw: { type: String },
    seating_capacity: { type: String },
    coverage_type: { type: String },
    policy_type: { type: String },
    cpa: { type: String },
    risk_start_date: { type: Date },
    risk_end_date: { type: Date },
    issue_date: { type: Date },

    endorsement_start_date: { type: Date },
    endorsement_end_date: { type: Date },
    endorsement_issue_date: { type: Date },

    insured_age: { type: String },
    policy_term: { type: String },
    bqp: { type: String },
    salesman: { type: String },
    pos_name: { type: String },
    pos: { type: String },
    slab: { type: String  },
    employee: { type: String },
    OD_premium: { type: String },
    TP_terrorism: { type: String },
    net: { type: String },
    gst_amount: { type: String },
    gst_gcv_amount: { type: String },
    total: { type: String },
    payment_mode: { type: String },

    pos_od: { type: String },
    pos_od_percent: { type: String },
    pos_tp: { type: String },
    pos_tp_percent: { type: String },

    actualA: { type: String },
    actualB: { type: String },
    actualC: { type: String },

    invoiceA: { type: String },
    invoiceB: { type: String },
    invoiceC: { type: String },

    experiya_od_commission: { type: String },
    experiya_od_commission_percent: { type: String },
    experiya_tp_commission: { type: String },
    experiya_tp_commission_percent: { type: String },
    experiya_od_reward: { type: String },
    experiya_od_reward_percent: { type: String },
    experiya_tp_reward: { type: String },
    experiya_tp_reward_percent: { type: String },

    proposal: { type: String },
    mandate: { type: String },
    policy: { type: String },
    previous_policy: { type: String },
    endors_copy: { type: String },
    pan_card: { type: String },
    aadhar_card: { type: String },
    vehicle_rc: { type: String },
    inspection_report: { type: String },
    remark: { type: String },
    status: { type: String,  },
    createdBy: { type: String,  },
    createdAt: { type: Date, default: Date.now },

    recentChanges: { type: Array}
});

// Pre-save hook to trim & uppercase all fields except password
schema.pre('save', function (next) {
    const doc = this;
    const fieldsToExclude = ['proposal', 'mandate', 'policy', 'previous_policy', 'endors_copy', 'pan_card', 'aadhar_card', 'vehicle_rc', 'inspection_report'];
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
        // delete ret._id;      
    }
});

module.exports = mongoose.model('Policy', schema);