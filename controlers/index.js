const AdminModel = require('../models/AdminModel')
const EmailModel = require('../models/EmailModel')

const StateModel = require('../models/State')
const CityModel = require('../models/City')

module.exports.Deshbord = async (req, res) => {
    try {
        //Mail counting
        let CountMail = await EmailModel.find().countDocuments()
        let CountState = await StateModel.find().countDocuments()
        let CountCity = await CityModel.find().countDocuments()

        // Sending Mail
        const State = await StateModel.find({status:true})


        return res.render('Deshbord', { CountMail,CountState,CountCity,State})
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.AddData = async (req, res) => {
    try {
        const State = await StateModel.find({status:true})

        return res.render('Admin/AddAdmin',{State})
    }
    catch (err) {
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
                let addadmin = await AdminModel.create(req.body)
                if (addadmin) {
                    console.log('admin is added');
                    return res.redirect('back')
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
        else{
            console.log('email is alredy register');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ViewAdmin = async (req, res) => {
    try {
        let AdminData = await AdminModel.find()

        return res.render('Admin/ViewAdmin', {
            AdminData
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.UpdateAdminPage = async (req, res) => {
    try {
        let AdminData = await AdminModel.findById(req.query.id)

        return res.render('Admin/EditAdmin', {
            AdminData
        })
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
            return res.redirect('/viewadmin')
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