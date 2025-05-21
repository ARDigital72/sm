function getReferer(req) {
   return req.get('Referer') || '/';
}
const AdminModel = require('../models/AdminModel')
const EmailModel = require('../models/EmailModel')
const EmailActivity = require('../models/EmailActivity')
const StateModle = require('../models/State')
const CityModle = require('../models/City')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");

// Render Send Mail Page for the User
module.exports.SendMailpage = async (req, res) => {
    try {
        return res.render('Mail/Sendmail', { user: req.user });
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
}
// Render AddMailPage with active states
module.exports.AddMailPage = async (req, res) => {
    try {
        let State = await StateModle.find({ status: true })
        return res.render('Mail/AddMail', {
            user: req.user,
            State
        })
    }
    catch (err) {
        console.log(err);
        return res.redirect(getReferer(req))
    }
}
// Add Email Address to Database
module.exports.AddMail = async (req, res) => {
    try {
        req.body.user = req.user.id
        let EmailData = await EmailModel.create(req.body)
        if (EmailData) {
            console.log('Email added successfully');
            return res.redirect(getReferer(req))
        } else {
            console.log('Something went wrong');
            return res.redirect(getReferer(req))
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect(getReferer(req))
    }
}
// View All Emails for the User
module.exports.ViewEmail = async (req, res) => {
    try {
        let TotalEmail = await EmailModel.find({ user: req.user.id }).countDocuments();
        let per_page = 1500, page = req.query.page || 1, totalPage = Math.ceil(TotalEmail / per_page);

        let EmailData = await EmailModel.find({ user: req.user.id })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .populate('city state user')
            .exec();

        return res.render('Mail/Viewmail', { user: req.user, EmailData, totalPage, page, per_page });
    }
    catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
}
// Delete Email by ID
module.exports.DeleteMail = async (req, res) => {
    try {
        let DeleteAdmin = await EmailModel.findByIdAndDelete(req.query.id);
        console.log(DeleteAdmin ? 'Email deleted successfully' : 'Error occurred');
        return res.redirect(getReferer(req));
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
}
// Send Mail logic for sender login
module.exports.SendMails = async (req, res) => {
    try {
        let checkuser = await AdminModel.find({ email: req.body.email }).countDocuments();
        
        // Check if user exists
        if (checkuser === 1) {
            let checkuserdata = await AdminModel.findOne({ email: req.body.email });

            // Compare entered password with stored password
            let checkuserpassword = await bcrypt.compare(req.body.password, checkuserdata.password);

            if (checkuserpassword) {
                let lot = parseInt(req.body.numberofmail);
                checkuserdata = { email: checkuserdata.email, key: checkuserdata.key, lot };

                res.cookie("senderuser", JSON.stringify(checkuserdata));  // Store user data in cookie
                req.flash('success', "Sender login successfully");

                return res.redirect('/sendmail/additempage');
            } else {
                console.log('Incorrect password');
                return res.redirect(getReferer(req));
            }
        } else {
            console.log('Email not registered');
            return res.redirect(getReferer(req));
        }
    } catch (err) {
        console.log(err);
    }
}
// Render Add Item Page for Mail
module.exports.AddItemPage = async (req, res) => {
    try {
        return res.render('Mail/additems', {
            user: req.user, errorData: [], oldData: []
        });
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
}
// Add Item for Mail and Send Mails to Users
module.exports.AddItem = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.render('Mail/additems', {
                user: req.user,
                errorData: error.mapped(),
                oldData: req.body
            });
        } else {
            user = JSON.parse(req.cookies.senderuser);
            res.clearCookie('senderuser');
            let checkuser = await AdminModel.find({ email: user.email }).countDocuments();
            if (checkuser == 1) {
                let checkuserdata = (await AdminModel.find({ email: user.email }))[0];
                if (checkuserdata.key == user.key) {
                    let lot = user.lot;
                    let limit = 500;
                    let allemail = await EmailModel.find({ user: req.user.id }).skip((lot - 1) * limit).limit(limit);
                    console.log(allemail);
                    let activity = (await EmailActivity.find({ user: checkuserdata.id }))[0];
                    let totalsend = activity.today;
                    let product = req.body;

                    allemail.map(async (item, i) => {
                        if (totalsend < 500) {
                            sendingMail(item.email, product, user, activity.id);
                        } else {
                            return false;
                        }
                        totalsend++;
                    });

                    return res.redirect('/');
                } else {
                    console.log('Invalid Key');
                    return res.redirect(getReferer(req));
                }
            } else {
                console.log('Invalid Email');
                return res.redirect(getReferer(req));
            }
        }
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req));
    }
}

async function sendingMail(item, product, checkuserdata, EmailActivity_Id, req) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: checkuserdata.email,
            pass: "cszmrbtlfhypuhfe"
        },
    });

    try {
        const info = await transporter.sendMail({
            from: checkuserdata.email,
            to: item,
            subject: "AR Digital Shop",
            text: "AR Digital Shop",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>eCommerce Email</title>
                    <style>
                        :root {
                            --primary-color: #ff6600;
                            -getReferer(req)round-color: RED;
                            --text-color: #ffffff;
                            --border-color: #ddd;
                            --btn-radius: 8px;
                        }
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                        getReferer(req)round: #ffffff;
                            padding: 20px;
                        }
                        .header {
                            text-align: center;
                        getReferer(req)round: var(--primary-color);
                            padding: 10px;
                            color: var(--text-color);
                            font-size: 24px;
                            font-weight: bold;
                        }
                        .product-grid {
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: space-between;
                        }
                        .product {
                            width: 48%;
                            margin-bottom: 20px;
                        getReferer(req)round: #fff;
                            padding: 10px;
                            border: 1px solid var(--border-color);
                            text-align: center;
                            box-sizing: border-box;
                        }
                        .product img {
                            max-width: 100%;
                            height: auto;
                        }
                        .btn {
                            display: inline-block;
                            padding: 10px;
                        getReferer(req)round: var(--primary-color);
                            color: var(--text-color);
                            text-decoration: none;
                            margin-top: 10px;
                            border-radius: var(--btn-radius);
                        }
                        .footer {
                            text-align: center;
                            padding: 10px;
                        getReferer(req)round: var(--primary-color);
                            color: var(--text-color);
                            margin-top: 20px;
                        }
                        .footer img {
                            width: 30px;
                            margin: 0 5px;
                        }
                        @media (max-width: 600px) {
                            .product {
                                width: 48%;
                            }
                        }
                        @media (max-width: 480px) {
                            .product {
                                width: 100%;
                            }
                        }
                    </style>
                </head>

                <body>
                    <label for="colorPicker">Choose a color:</label>
                <input type="color" id="colorPicker" name="colorPicker">

                    <div class="container">
                        <div class="header">Our Best Products</div>
                        <div class="product-grid">
                            <div class="product">
                                <img src="${product.imglink_1}" alt="Product 1">
                                <h3>${product.name_1}</h3>
                                <p>${product.price_1}</p>
                                <a href="${product.prolink_1}" class="btn">Buy Now</a>
                            </div>
                            <div class="product">
                                <img src="${product.imglink_2}" alt="Product 2">
                                <h3>${product.name_2}</h3>
                                <p>${product.price_2}</p>
                                <a href="${product.prolink_2}" class="btn">Buy Now</a>
                            </div>
                            <div class="product">
                                <img src="${product.imglink_3}" alt="Product 3">
                                <h3>${product.name_3}</h3>
                                <p>${product.price_3}</p>
                                <a href="${product.prolink_3}" class="btn">Buy Now</a>
                            </div>
                            <div class="product">
                                <img src="${product.imglink_4}" alt="Product 4">
                                <h3>${product.name_4}</h3>
                                <p>${product.price_4}</p>
                                <a href="${product.prolink_4}" class="btn">Buy Now</a>
                            </div>
                            <div class="product">
                                <img src="${product.imglink_5}" alt="Product 5">
                                <h3>${product.name_5}</h3>
                                <p>${product.price_5}</p>
                                <a href="${product.prolink_5}" class="btn">Buy Now</a>
                            </div>
                            <div class="product">
                                <img src="${product.imglink_6}" alt="Product 6">
                                <h3>${product.name_6}</h3>
                                <p>${product.price_6}</p>
                                <a href="${product.prolink_6}" class="btn">Buy Now</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Follow us on</p>
                            <a href="https://www.facebook.com"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook"></a>
                            <a href="https://www.instagram.com"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram"></a>
                            <a href="https://twitter.com"><img src="https://upload.wikimedia.org/wikipedia/en/6/60/Twitter_Logo_as_of_2021.svg" alt="Twitter"></a>
                            <a href="https://www.linkedin.com"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn"></a>
                        </div>
                    </div>
                </body>
                </html>   
              `,
        });

        if (info) {
            let today = new Date()
            let Data = await EmailActivity.findById(EmailActivity_Id)
            if (Data.updatedAt.toLocaleDateString() != today.toLocaleDateString()) {
                await EmailActivity.findByIdAndUpdate(Data.id, { $inc: { today: 1, year: 1 } })
            } else {
                await EmailActivity.findByIdAndUpdate(Data.id, { $inc: { today: 1, year: 1 } })
            }
        }
    } catch (err) {
        console.log(err);
        return res.redirect(getReferer(req))
    }
}
//ajex
module.exports.FindCity = async (req, res) => {
    let City = await CityModle.find({ state: req.query.State, status: true }).populate('state').exec()
    let options = `<option>--select city--</option>`
    City.map((item, i) => {
        options += `<option value=${item.id}>${item.city}</option>`
    })

    return res.json(options)
}
module.exports.NumberOfMail = async (req, res) => {
    let CountMail = await EmailModel.countDocuments({user:req.user.id, city: req.query.City, state: req.query.State }).populate('city').populate('state').exec()
    return res.json(CountMail)
}