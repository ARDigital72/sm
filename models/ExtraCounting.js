const mongose = require('mongoose')

const EmailSchma = mongose.Schema({
    SendMail:{
        type:Array
    }
},{
    timestamps:true
})

const ExtraCounting = mongose.model('ExtraCounting',EmailSchma)

module.exports = ExtraCounting