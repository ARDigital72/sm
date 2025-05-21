function getReferer(req) {
    return req.get('Referer') || '/';
}

const bcrypt = require('bcrypt');
const AdminModel = require('../models/AdminModel');
const EmailModel = require('../models/EmailModel');
const EmailActivity = require('../models/EmailActivity');
const StateModel = require('../models/State');
const error = require('../models/Error');

// auth
module.exports.loginpage = async (req, res) => {
    try {
        if (req.cookies.login) return res.redirect('/');
        return res.render('auth/login');
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Login successful redirect
module.exports.login = async (req, res) => {
    try {
        req.flash('success', "login successfully");
        return res.redirect('/');
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Render registration page with states
module.exports.Register = async (req, res) => {
    try {
        const State = await StateModel.find({ status: true }); // Fetch active states
        res.render('auth/Register', { State });
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Render change password page
module.exports.ChangPasswordPage = async (req, res) => {
    try {
        return res.render('auth/ChangPassword');
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Change password functionality
module.exports.ChangPassword = async (req, res) => {
    try {
        let currentpassword = await bcrypt.compare(req.body.current_password, req.user.password);
        if (currentpassword) {
            if (req.body.current_password !== req.body.password) {
                if (req.body.password === req.body.conform_password) {
                    req.body.password = await bcrypt.hash(req.body.password, 10);
                    let changpassword = await AdminModel.findByIdAndUpdate(req.user.id, { password: req.body.password });
                    if (changpassword) return res.redirect('/signout');
                    console.log('password not changed');
                    return res.redirect(getReferer(req));
                } else {
                    console.log('password and confirm password do not match');
                    return res.redirect(getReferer(req));
                }
            } else {
                console.log('current and new passwords match');
                return res.redirect(getReferer(req));
            }
        } else {
            console.log('current password is wrong');
            return res.redirect(getReferer(req));
        }
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Sign out functionality
module.exports.SignOut = async (req, res) => {
    try {
        req.session.destroy(function (err) {
            if (err) return false;
            return res.redirect('/');
        });
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// admin routes
// Dashboard functionality
module.exports.Deshbord = async (req, res) => {
    try {
        let CountMail = await EmailModel.find({ user: req.user.id }).countDocuments();
        let today = new Date();
        let Mail = (await EmailActivity.find({ user: req.user.id }))[0];
        if (Mail.updatedAt.toLocaleDateString() !== today.toLocaleDateString()) {
            await EmailActivity.updateOne({ user: req.user.id }, { today: 0 });
        }
        Mail = await EmailActivity.findById(Mail.id);
        const State = await StateModel.find({ status: true });
        return res.render('Deshbord', { user: req.user, CountMail, year: Mail.year, today: Mail.today, State });
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Profile functionality
module.exports.Profile = async (req, res) => {
    try {
        let user = await AdminModel.findById(req.user.id);
        return res.render('Profile', { user });
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Insert admin functionality
module.exports.InsertAdmin = async (req, res) => {
    try {
        let checkmail = await AdminModel.find({ email: req.body.email }).countDocuments();
        if (checkmail == 0) {
            if (req.body.password === req.body.conform_password) {
                req.body.status = true;
                req.body.role = 'user';

                let addadmin = await AdminModel.create(req.body);
                if (addadmin) {
                    await EmailActivity.create({ user: addadmin.id, year: 0, today: 0 });
                    await error.create({ user: addadmin.id, error: 200 });
                    return res.redirect('/signout');
                } else {
                    console.log('admin not added');
                    return res.redirect('/');
                }
            } else {
                console.log('password does not match');
                return res.redirect(getReferer(req));
            }
        } else {
            console.log('email is already registered');
            return res.redirect(getReferer(req));
        }
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Update admin functionality
module.exports.UpdateAdmin = async (req, res) => {
    try {
        let UpdateAdmin = await AdminModel.findByIdAndUpdate(req.body.id, req.body);
        if (UpdateAdmin) {
            console.log('Admin updated');
            return res.redirect(getReferer(req));
        } else {
            console.log('Admin not updated');
            return res.redirect(getReferer(req));
        }
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Delete admin functionality
module.exports.DeleteAdmin = async (req, res) => {
    try {
        let DeleteAdmin = await AdminModel.findByIdAndDelete(req.query.id);
        if (DeleteAdmin) {
            console.log('Admin deleted');
            return res.redirect(getReferer(req));
        } else {
            console.log('Admin not deleted');
            return res.redirect(getReferer(req));
        }
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};

// Change admin status functionality
module.exports.AdminStatus = async (req, res) => {
    try {
        let status = req.query.status || true; // Set status based on query parameter
        let ChangStatus = await AdminModel.findByIdAndUpdate(req.query.id, { status: status });

        if (ChangStatus) {
            console.log('Admin status changed');
            return res.redirect(getReferer(req));
        } else {
            console.log('Admin status not changed');
            return res.redirect(getReferer(req));
        }
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
};
