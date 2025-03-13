const AdminModel = require('../models/AdminModel')
const EmailModel = require('../models/EmailModel')
const StateModle = require('../models/State')
const CityModle = require('../models/City')

const ExtraCounting = require('../models/ExtraCounting')
const nodemailer = require("nodemailer");

module.exports.SendMailpage = async (req, res) => {
    try {
        return res.render('Mail/Sendmail')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}


// add Mail Adress
module.exports.AddMailPage = async (req, res) => {
    try {
        let State = await StateModle.find({ status: true })

        return res.render('Mail/AddMail', {
            State
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.FindCity = async (req, res) => {
    let City = await CityModle.find({ state: req.query.State, status: true }).populate('state').exec()
    let options = `<option>--select city--</option>`
    City.map((item, i) => {
        options += `<option value=${item.id}>${item.city}</option>`
    })

    return res.json(options)
}

module.exports.AddMail = async (req, res) => {
    try {
        let abc = ['a', 'b', 't', 'b', 'f', 'e', 'd', 'c', 'b', 'a']


        abc = [...new Set(abc)]



        abc.map(async (item, i) => {
            let Data = {
                email: item,
                state: req.body.state,
                city: req.body.city
            }
            let EmailData = await EmailModel.create(Data)
        })

        return res.redirect('back')
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.ViewEmail = async (req, res) => {
    try {
        let TotalEmail = await EmailModel.find().countDocuments()

        let per_page = 1500
        let page = 1
        let totalPage = Math.ceil(TotalEmail / per_page)

        if (req.query.page) {
            page = req.query.page
        }


        let EmailData = await EmailModel.find().skip((page - 1) * per_page).limit(per_page).populate('city').populate('state').exec()

        return res.render('Mail/Viewmail', {
            EmailData, totalPage, page, per_page
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.DeleteMail = async (req, res) => {
    try {
        let DeleteAdmin = await EmailModel.findByIdAndDelete(req.query.id)
        if (DeleteAdmin) {
            console.log('delete admin');
            return res.redirect('back')
        }
        else {
            console.log('something wrong');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}



//send mail
module.exports.SendMails = async (req, res) => {
    try {
        let checkuser = await AdminModel.find({ email: req.body.email }).countDocuments()
        if (checkuser == 1) {
            let checkuserdata = await AdminModel.find({ email: req.body.email })
            // console.log(checkuserdata);
            if (checkuserdata.password == req.body.password) {
                let lot = parseInt(req.body.numberofmail)
                let limit = 500
                let allemail = await EmailModel.find().skip((lot - 1) * limit).limit(limit)

                allemail.map((item, i) => {
                    // code of mail

                    // console.log(item.email);
                })

                console.log('ok');

            }else{
                console.log('worng password');
                return res.redirect('back')
            }
        } else if (checkuser == 0) {
            console.log('email is not register');
            return res.redirect('back')
        } else {
            console.log('something wrong');
            return res.redirect('back')
        }

        return res.redirect('back')
    }
    catch (err) {
        console.log(err);
    }
}

// --------------done to conut-----------------
module.exports.Done = async (req, res) => {
    try {
        console.log(Date());

        let TryDate = {
            TodayDate: Date(),
            Mail: 0
        }
        await ExtraCounting.create({ SendMail: TryDate })
        let PastSendMail = await ExtraCounting.find()

        if (PastSendMail) {
            await PastSendMail.map((item, i) => {
                if (item.SendMail[0].TodayDate == Date()) {
                    console.log('ok');
                }
                else {
                    console.log('not ok');
                }
            })
            // console.log(PastSendMail);
        }
        else {
            console.log('Something Wrong!! Past Data Is Not Show');
            return res.redirect('back')
        }

    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}

