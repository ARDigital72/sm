const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Emails')

const db = mongoose.connection

db.once('open',(err)=>{
    if(err){
        console.log(err);
        return false
    }
    console.log('DataBase is connected');
})

module.exports = db;