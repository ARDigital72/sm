const mongose = require('mongoose')

const EmailSchma = mongose.Schema({
    email:{
        type:String
    },city:{
        type:mongose.Schema.Types.ObjectId,
        ref:'city'
    },state:{
        type:mongose.Schema.Types.ObjectId,
        ref:'state'
    }
})

const Email = mongose.model('Email',EmailSchma)

module.exports = Email