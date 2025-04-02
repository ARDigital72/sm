const express = require('express')

const passport = require('passport')

const routes = express.Router()

const SendMailCtrl = require('../controlers/Mail')

const { check } = require('express-validator');

routes.get('/', SendMailCtrl.SendMailpage)

routes.post('/sendmail', SendMailCtrl.SendMails)

routes.get('/additempage', SendMailCtrl.AddItemPage)

routes.post('/additem', [
    check('name_1').notEmpty().withMessage('product name is required').isLength({ min: 2 }).withMessage('product name is minimum 2 charcter'),
    check('name_2').notEmpty().withMessage('product name is required').isLength({ min: 2 }).withMessage('product name is minimum 2 charcter'),
    check('name_3').notEmpty().withMessage('product name is required').isLength({ min: 2 }).withMessage('product name is minimum 2 charcter'),
    check('name_4').notEmpty().withMessage('product name is required').isLength({ min: 2 }).withMessage('product name is minimum 2 charcter'),
    check('name_5').notEmpty().withMessage('product name is required').isLength({ min: 2 }).withMessage('product name is minimum 2 charcter'),
    check('name_6').notEmpty().withMessage('product name is required').isLength({ min: 2 }).withMessage('product name is minimum 2 charcter'),

    check('price_1').notEmpty().withMessage('price required').isNumeric().withMessage('plase Enter Number value'),
    check('price_2').notEmpty().withMessage('price required').isNumeric().withMessage('plase Enter Number value'),
    check('price_3').notEmpty().withMessage('price required').isNumeric().withMessage('plase Enter Number value'),
    check('price_4').notEmpty().withMessage('price required').isNumeric().withMessage('plase Enter Number value'),
    check('price_5').notEmpty().withMessage('price required').isNumeric().withMessage('plase Enter Number value'),
    check('price_6').notEmpty().withMessage('price required').isNumeric().withMessage('plase Enter Number value'),

    check('prolink_1').notEmpty().withMessage('product link required').isURL().withMessage('Invalid URL'),
    check('prolink_2').notEmpty().withMessage('product link required').isURL().withMessage('Invalid URL'),
    check('prolink_3').notEmpty().withMessage('product link required').isURL().withMessage('Invalid URL'),
    check('prolink_4').notEmpty().withMessage('product link required').isURL().withMessage('Invalid URL'),
    check('prolink_5').notEmpty().withMessage('product link required').isURL().withMessage('Invalid URL'),
    check('prolink_6').notEmpty().withMessage('product link required').isURL().withMessage('Invalid URL'),

    check('imglink_1').notEmpty().withMessage('image link required').isURL().withMessage('Invalid URL'),
    check('imglink_2').notEmpty().withMessage('image link required').isURL().withMessage('Invalid URL'),
    check('imglink_3').notEmpty().withMessage('image link required').isURL().withMessage('Invalid URL'),
    check('imglink_4').notEmpty().withMessage('image link required').isURL().withMessage('Invalid URL'),
    check('imglink_5').notEmpty().withMessage('image link required').isURL().withMessage('Invalid URL'),
    check('imglink_6').notEmpty().withMessage('image link required').isURL().withMessage('Invalid URL')

], SendMailCtrl.AddItem)

routes.get('/addemailpage', passport.checkAuthUser, SendMailCtrl.AddMailPage)

routes.post('/addmail', passport.checkAuthUser, SendMailCtrl.AddMail)

routes.get('/viewemail', passport.checkAuthUser, SendMailCtrl.ViewEmail)

routes.get('/deletemail', passport.checkAuthUser, SendMailCtrl.DeleteMail)


// ajex
routes.get('/findcity', SendMailCtrl.FindCity)
routes.get('/numberofcity', SendMailCtrl.NumberOfMail)

module.exports = routes