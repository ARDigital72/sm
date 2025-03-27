const mongose = require('mongoose')

const MailActivitySchma = mongose.Schema({
    user: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    today:{
        type:Number
    },
    year:{
        type:Number
    }
}, {
    timestamps: true
})

const mailactivity = mongose.model('mailactivity', MailActivitySchma)

module.exports = mailactivity