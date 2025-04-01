const express = require('express')

const passport = require('passport');

const routes = express.Router()

const mainCtrl = require('../controlers')

const AdminModel = require('../models/AdminModel')

const Error = require('../confing/error')

routes.get('/loginpage', mainCtrl.loginpage)

routes.post('/login', passport.authenticate('local', { failureredirect: '/loginpage' }), mainCtrl.login)

routes.get('/register', mainCtrl.Register)

routes.post('/addadmin', AdminModel.uploadimg, mainCtrl.InsertAdmin)

// after Login or Register
routes.get('/changpassword', Error, passport.checkAuthUser, mainCtrl.ChangPasswordPage)

routes.post('/changpassword', Error, passport.checkAuthUser, mainCtrl.ChangPassword)

routes.get('/signout', Error, passport.checkAuthUser, mainCtrl.SignOut)

// Admin / User
routes.get('/', Error, passport.checkAuthUser, mainCtrl.Deshbord)

routes.get('/profile', Error, passport.checkAuthUser, mainCtrl.Profile)

routes.post('/updateadmin', Error, AdminModel.uploadimg, passport.checkAuthUser, mainCtrl.UpdateAdmin)

routes.get('/deleteadmin', Error, passport.checkAuthUser, mainCtrl.DeleteAdmin)//logout

routes.get('/status', Error, passport.checkAuthUser, mainCtrl.AdminStatus)

// other routing calling
routes.use('/sendmail',Error,require('./Mail'))

module.exports = routes