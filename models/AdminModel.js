const mongose = require('mongoose')

const AdminSchma = mongose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    gender:{
        type:String
    },
    status:{
        type:Boolean
    }
},{
    timestamps:true
})

const admin = mongose.model('admin',AdminSchma)

module.exports = admin