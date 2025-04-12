const path = require('path')
const fs = require('fs')

const bcrypt = require('bcrypt')

const AdminModel = require('../models/AdminModel')
const EmailModel = require('../models/EmailModel')
const EmailActivity = require('../models/EmailActivity')
const StateModel = require('../models/State')
const CityModel = require('../models/City')
const error = require('../models/Error')

// auth
module.exports.loginpage = async (req, res) => {
    try {
        if (req.cookies.login) {
            return res.redirect('/')
        }
        else {
            return res.render('auth/login')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.login = async (req, res) => {
    try {
        req.flash('success', "login successfully")
        return res.redirect('/')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.Register = async (req, res) => {
    try {
        const State = await StateModel.find({ status: true })
        res.render('auth/Register', { State })
    } catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ChangPasswordPage = async (req, res) => {
    try {
        return res.render('auth/ChangPassword')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ChangPassword = async (req, res) => {
    try {
        let currentpassword = await bcrypt.compare(req.body.current_password, req.user.password)
        if (currentpassword) {
            if (req.body.current_password != req.body.password) {
                if (req.body.password == req.body.conform_password) {
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    let changpassword = await AdminModel.findByIdAndUpdate(req.user.id, { password: req.body.password })
                    if (changpassword) {
                        console.log('password chang successfully');
                        return res.redirect('/signout')
                    } else {
                        console.log('password not chang');
                        return res.redirect('back')
                    }
                } else {
                    console.log('password and conform password is not match');
                    return res.redirect('back')
                }
            } else {
                console.log('current and new password is match');
                return res.redirect('back')
            }
        } else {
            console.log('current password is wrong');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.SignOut = async (req, res) => {
    try {
        req.session.destroy(function (err) {
            if (err) {
                return false
            }
            return res.redirect('/')
        })
    } catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}


// admin routes
module.exports.Deshbord = async (req, res) => {
    try {
        //Mail counting
        let CountMail = await EmailModel.find({ user: req.user.id }).countDocuments()

        // Sending Mail
        let today = new Date()
        let Mail = (await EmailActivity.find({ user: req.user.id }))[0]
        if (Mail.updatedAt.toLocaleDateString() != today.toLocaleDateString()) {
            await EmailActivity.updateOne({ user: req.user.id }, { today: 0 })
        }
        Mail = await EmailActivity.findById(Mail.id)

        const State = await StateModel.find({ status: true })
        return res.render('Deshbord', { user: req.user, CountMail, year: Mail.year, today: Mail.today, State })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.Profile = async (req, res) => {
    try {
        let user = await AdminModel.findById(req.user.id)
        return res.render('Profile', { user })
    } catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.InsertAdmin = async (req, res) => {
    try {
        let checkmail = await AdminModel.find({ email: req.body.email }).countDocuments()
        if (checkmail == 0) {
            if (req.body.password == req.body.conform_password) {
                req.body.status = true
                req.body.role = 'user'

                let addadmin = await AdminModel.create(req.body)
                if (addadmin) {
                    await EmailActivity.create({ user: addadmin.id, year: 0, today: 0 })
                    await error.create({ user: addadmin.id, error: 200 })
                    console.log('admin is added');
                    return res.redirect('/signout')
                }
                else {
                    console.log('admin not add');
                    return res.redirect('/')
                }
            }
            else {
                console.log('password is not match');
                return res.redirect('back')
            }
        }
        else {
            console.log('email is alredy register');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.UpdateAdmin = async (req, res) => {
    try {
        let UpdateAdmin = await AdminModel.findByIdAndUpdate(req.body.id, req.body)
        if (UpdateAdmin) {
            console.log('Admin update');
            return res.redirect('back')
        } else {
            console.log('Admin not update');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.DeleteAdmin = async (req, res) => {
    try {
        let singledata = await AdminModel.findById(req.query.id)
        let oldpath = ''
        if (singledata.image) {
            oldpath = path.join(__dirname, '..', singledata.image);
            await fs.unlinkSync(oldpath)
        }

        let DeleteAdmin = await AdminModel.findByIdAndDelete(req.query.id)
        if (DeleteAdmin) {
            console.log('Delete Admin');
            return res.redirect('back')
        } else {
            console.log('Admin not Delete');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.AdminStatus = async (req, res) => {
    try {
        let status = true
        if (req.query) {
            status = req.query.status
        }

        let ChangStatus = await AdminModel.findByIdAndUpdate(req.query.id, { status: status })
        if (ChangStatus) {
            console.log('Admin status chang');
            return res.redirect('back')
        } else {
            console.log('Admin Status not Chang');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}