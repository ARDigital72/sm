const express = require('express');
const path = require('path');

const port = 8000;

const app = express()

// const db = require('./confing/db');

const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ardigitalshop72:arpitguna@cluster0.mboxp.mongodb.net/email', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((res) => {
    console.log('DB is connected');
}).catch((err) => {
    console.log(err);
})


const cookieparser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('./confing/PassportLocal')
const session = require('express-session')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(cookieparser())
app.use(express.urlencoded())

app.use(express.static(path.join(__dirname, 'assets')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(session({
    // name: "AR",
    secret: 'ARPATEL',
    resave: false,
    saveuninitilized: false,
    cookie: {
        maxAge: 10000 * 60 * 60
    }
}))

// app.use(passport.initialize())
app.use(passport.session())

// app.use(passport.setAuthUser)

// if (2 == 1) {
//     app.use('/', require('./routers'))
// } else {
//     app.get('/', (req, res) => {
//         res.render('layouts/404')
//     })
// }
// let a = 6
// switch (a) {
//     case 1:
//         app.get('/', (req, res) => {
//             res.render('layouts/error_400')
//         })
//         break;

//     case 2:
//         app.get('/', (req, res) => {
//             res.render('layouts/error_403')
//         })
//         break;

//     case 3:
//         app.get('/', (req, res) => {
//             res.render('layouts/error_404')
//         })
//         break;

//     case 4:
//         app.get('/', (req, res) => {
//             res.render('layouts/error_500')
//         })
//         break;

//     default:
//         app.use('/', require('./routers'))
//         break;
// }

app.use('/', require('./routers'))
app.use('/sendmail', require('./routers/Mail'))
app.use('/fun', passport.checkAuthUser, require('./routers/Functionality'))

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log('server is run');
})