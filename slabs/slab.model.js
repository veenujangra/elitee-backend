const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;
const schema = new Schema({
    profileId: { type: String,  },
    slabId: {
        type: String,
        required: true,
        default: () => uuidv4().replace(/-/g, '').slice(0, 4) // Customize based on library options
    },
    name: { type: String, required: true },
    status: { type: String, },
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

module.exports = mongoose.model('Slab', schema);


