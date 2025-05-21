const mongoose = require('mongoose');

const errorSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    error: {
        type: Number
    }
}, {
    timestamps: true
});

const Error = mongoose.model('error', errorSchema);
module.exports = Error;
