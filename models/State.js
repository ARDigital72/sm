const mongose = require('mongoose')

const stateSchma = mongose.Schema({
    state: {
        type: String
    }, city: {
        type: Array
    }, status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const state = mongose.model('state', stateSchma)

module.exports = state