const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    city: {
        type: String
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'state'
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const City = mongoose.model('city', citySchema);
module.exports = City;
