const mongoose = require('mongoose');

const MailActivitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    today: {
        type: Number
    },
    year: {
        type: Number
    }
}, {
    timestamps: true
});

const MailActivity = mongoose.model('mailactivity', MailActivitySchema);
module.exports = MailActivity;
