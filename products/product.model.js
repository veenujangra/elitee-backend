const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
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

module.exports = mongoose.model('Product', schema);