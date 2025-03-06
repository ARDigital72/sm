const mongose = require('mongoose')

const citySchma = mongose.Schema({
    city: {
        type: String
    },
    state: {
        type: mongose.Schema.Types.ObjectId,
        ref: 'state'
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const city = mongose.model('city', citySchma)

module.exports = city