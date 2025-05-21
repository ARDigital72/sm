const mongoose = require('mongoose');

const EmailSchema = mongoose.Schema({
    email: {
        type: String
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'city'
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'state'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    }
});

const Email = mongoose.model('Email', EmailSchema);
module.exports = Email;
