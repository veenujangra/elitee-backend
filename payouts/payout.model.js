const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    slabId: { type: String },
    slabName: { type: String },
    payout_name: { type: String },
    isVehicleNew: { type: Array },
    vehicleAge: { type: Array },
    insurance_company: { type: Array },
    vehicle_catagory: { type: Array },
    vehicle_makeby: { type: Array },
    vehicle_model: { type: Array },
    vehicle_fuel_type: { type: Array },
    state: { type: Array },
    RTO: { type: Array },

    isHighend: { type: Array },

    addon: { type: Array },
    ncb: { type: Array },
    cpa: { type: Array },

    startDate: { type: Date },
    endDate: { type: Date },

    cubic_capacity: { type: Array },
    coverage_type: { type: Array },
    seating_capacity: { type: Array },
    gvw: { type: Array },

    policy_term: { type: Array },
    policy_type: { type: Array },

    pos_od: { type: String },
    pos_tp: { type: String },
    experiya_od_commission: { type: String },
    experiya_tp_commission: { type: String },
    experiya_od_reward: { type: String },
    experiya_tp_reward: { type: String },

    remark: { type: String },

    status: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to uppercase all fields 
schema.pre('save', function(next) {    
    const doc = this;
    // Loop through each field in the schema
    Object.keys(doc.schema.paths).forEach(function(path) {
        // Check if the path is of type String
        if (doc[path] && doc[path].constructor === Array && doc[path].length > 0) {
            // If it's an array, loop through its elements
            doc[path] = doc[path].map(function(item) {
                return typeof item === 'string' ? item.trim().toUpperCase() : item;
            });
        } else if (doc[path] && doc[path].constructor === String) {
            // If it's a string, trim and uppercase it
            doc[path] = doc[path].trim().toUpperCase();
        }
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

module.exports = mongoose.model('Payout', schema);