const express = require('express')

const passport = require('passport');

const routes = express.Router()

const mainCtrl = require('../controlers')

const AdminModel = require('../models/AdminModel')


routes.get('/loginpage', mainCtrl.loginpage)

routes.post('/login', passport.authenticate('local', { failureredirect: '/loginpage' }), mainCtrl.login)

routes.get('/register', mainCtrl.Register)

routes.get('/changpassword', passport.checkAuthUser, mainCtrl.ChangPasswordPage)

routes.post('/changpassword', passport.checkAuthUser, mainCtrl.ChangPassword)

routes.get('/signout', passport.checkAuthUser, mainCtrl.SignOut)

// Admin / User
routes.get('/', passport.checkAuthUser, mainCtrl.Deshbord)

routes.get('/profile', passport.checkAuthUser, mainCtrl.Profile)

routes.get('/addadminpage', passport.checkAuthUser, mainCtrl.AddData)

routes.post('/addadmin', AdminModel.uploadimg, mainCtrl.InsertAdmin)

routes.get('/viewadmin', passport.checkAuthUser, mainCtrl.ViewAdmin)

routes.get('/updatedminpage', passport.checkAuthUser, mainCtrl.UpdateAdminPage)

routes.post('/updateadmin', AdminModel.uploadimg, passport.checkAuthUser, mainCtrl.UpdateAdmin)

routes.get('/deleteadmin', passport.checkAuthUser, mainCtrl.DeleteAdmin)

routes.get('/status', passport.checkAuthUser, mainCtrl.AdminStatus)

module.exports = routes