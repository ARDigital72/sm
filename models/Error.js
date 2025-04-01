const mongose = require('mongoose')

const errorSchma = mongose.Schema({
    user: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'admin'
    }, error: {
        type: Number
    }
}, {
    timestamps: true
})

const error = mongose.model('error', errorSchma)

module.exports = error