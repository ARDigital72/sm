const express = require('express')

const routes = express.Router()

const SendMailCtrl = require('../controlers/Mail')

routes.get('/',SendMailCtrl.SendMailpage)

routes.post('/sendmail',SendMailCtrl.SendMails)

routes.get('/addemailpage',SendMailCtrl.AddMailPage)

routes.post('/addmail',SendMailCtrl.AddMail)

routes.get('/viewemail',SendMailCtrl.ViewEmail)

routes.get('/deletemail',SendMailCtrl.DeleteMail)

routes.get('/done',SendMailCtrl.Done)

routes.get('/findcity',SendMailCtrl.FindCity)


module.exports = routes