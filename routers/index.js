const express = require('express')

const routes = express.Router()

const mainCtrl = require('../controlers')

const passport = require('passport');

routes.get('/loginpage',mainCtrl.loginpage)

routes.post('/login',passport.authenticate('local',{failureredirect:'/loginpage'}),mainCtrl.login)

routes.get('/register',mainCtrl.Register)

routes.get('/',passport.checkAuthUser,mainCtrl.Deshbord)

routes.get('/addadminpage',passport.checkAuthUser,mainCtrl.AddData)

routes.post('/addadmin',mainCtrl.InsertAdmin)

routes.get('/viewadmin',passport.checkAuthUser,mainCtrl.ViewAdmin)

routes.get('/updatedminpage',passport.checkAuthUser,mainCtrl.UpdateAdminPage)

routes.post('/updateadmin',passport.checkAuthUser,mainCtrl.UpdateAdmin)

routes.get('/deleteadmin',passport.checkAuthUser,mainCtrl.DeleteAdmin)

routes.get('/status',passport.checkAuthUser,mainCtrl.AdminStatus)



module.exports = routes