const express = require('express')

const routes = express.Router()

const mainCtrl = require('../controlers')

routes.get('/',mainCtrl.Deshbord)

routes.get('/addadminpage',mainCtrl.AddData)

routes.post('/addadmin',mainCtrl.InsertAdmin)

routes.get('/viewadmin',mainCtrl.ViewAdmin)

routes.get('/updatedminpage',mainCtrl.UpdateAdminPage)

routes.post('/updateadmin',mainCtrl.UpdateAdmin)

routes.get('/deleteadmin',mainCtrl.DeleteAdmin)

routes.get('/status',mainCtrl.AdminStatus)

routes.use('/fun',require('./Functionality'))

module.exports = routes