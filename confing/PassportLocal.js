const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const AdminModel = require('../models/AdminModel')


passport.use(new LocalStrategy({
    usernameField: 'email'
}, async function (email, password, done) {
    let adminData = await AdminModel.findOne({ email: email })
    if (adminData) {
        if (adminData.password == password) {
            return done(null, adminData)
        }
        else {
            return done(null, false)
        }
    }
    else {
        return done(null, false)
    }
}))

passport.serializeUser(function (user, done) {
    return done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
    let adminRecord = await AdminModel.findById(id)
    if (adminRecord) {
        return done(null, adminRecord)
    }
    else {
        return done(null, false)
    }
})

passport.setAuthUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    next();
}

passport.checkAuthUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/loginpage')
}

module.exports = passport;