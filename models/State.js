const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
    state: {
        type: String
    },
    city: {
        type: Array
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const State = mongoose.model('state', stateSchema);
module.exports = State;
