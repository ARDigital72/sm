const express = require('express');
const path = require('path');

const port = 8000;

const app = express()

// const db = require('./confing/db');
// const cookieParser = require('cookie-parser');

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ardigitalshop72:arpitguna@cluster0.mboxp.mongodb.net/email', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((res) => {
    console.log('DB is connected');
}).catch((err) => {
    console.log(err);
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname,'assets')))
app.use(express.urlencoded())


app.use('/', require('./routers'))
app.use('/sendmail',require('./routers/Mail'))
app.use('/fun',require('./routers/Functionality'))

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log('server is run');
})

