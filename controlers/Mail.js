const AdminModel = require('../models/AdminModel')
const EmailModel = require('../models/EmailModel')
const StateModle = require('../models/State')
const CityModle = require('../models/City')

// const ExtraCounting = require('../models/ExtraCounting')
const nodemailer = require("nodemailer");
const Email = require('../models/EmailModel');

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

module.exports.AddMail = async (req, res) => {
    try {
        // let abc = ['arpitguna150@gmail.com', 'arpitguna150@gmail.com', 'arpitguna150@gmail.com']

        // abc = [...new Set(abc)]

        // abc.map(async (item, i) => {
        //     let Data = {
        //         email: item,
        //         state: req.body.state,
        //         city: req.body.city
        //     }
        //     let EmailData = await EmailModel.create(Data)
        // })

        let EmailData = await EmailModel.create(req.body)
        if (EmailData) {
            console.log('Email add succesfully');
            return res.redirect('back')
        } else {
            console.log('something wrong');
            return res.redirect('back')
        }
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
            checkuserdata = checkuserdata[0]

            if (checkuserdata.password == req.body.password) {
                let lot = parseInt(req.body.numberofmail);

                checkuserdata = {
                    email: checkuserdata.email,
                    key: checkuserdata.key,
                    lot: lot
                }

                res.cookie("user", JSON.stringify(checkuserdata));

                return res.redirect('/sendmail/additempage');
            } else {
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
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.AddItem = async (req, res) => {
    try {
        user = JSON.parse(req.cookies.user)
        res.clearCookie('user')
        let checkuser = await AdminModel.find({ email: user.email }).countDocuments()
        if (checkuser == 1) {
            let checkuserdata = (await AdminModel.find({ email: user.email }))[0]
            if (checkuserdata.key == user.key) {
                let lot = user.lot
                let limit = 5;
                let allemail = await EmailModel.find().skip((lot - 1) * limit).limit(limit);

                let product = req.body
                console.log(product);
                allemail.map((item, i) => {
                    sendingMail(item.email, product, user)
                })

                return res.redirect('/')
            } else {
                console.log('Invaild Key');
                return res.redirect('back')
            }
        } else {
            console.log('Invaild Email');
            return res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back')
    }
}


async function sendingMail(item, product, checkuserdata) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: checkuserdata.email,
            pass: checkuserdata.key,
        },
    });

    const info = await transporter.sendMail({
        from: checkuserdata.email,
        to: item,
        subject: "AR Digital Shop",
        text: "AR Digital Shop",
        html: `
            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Exclusive Deals from Crete!</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }

                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }

                    .header {
                        text-align: center;
                        background-color: #007b5e;
                        color: white;
                        padding: 15px;
                        border-radius: 8px 8px 0 0;
                    }

                    .products {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-around;
                    }

                    .product {
                        width: 100%;
                        max-width: 280px;
                        margin: 10px auto;
                        text-align: center;
                    }

                    .product img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 5px;
                    }

                    h3{
                        color: black;
                    }

                    p{
                        color: gray;
                    }
                        
                    a{
                        text-decoration: none;
                    }

                    .cta {
                        text-align: center;
                        margin: 20px 0;
                    }

                    .cta a {
                        background: #007b5e;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                    }

                    .footer {
                        text-align: center;
                        padding: 10px;
                        font-size: 12px;
                        color: #666;
                    }

                    @media (min-width: 775px) {
                        .products {
                            flex-direction: row;
                        }

                        .product {
                            width: 30%;
                        }
                    }

                    @media (min-width: 420px) and (max-width: 774px) {
                        .products {
                            flex-direction: row;
                        }

                        .product {
                            width: 48%;
                        }
                    }

                    @media (max-width: 419px) {
                        .product {
                            width: 100%;
                        }
                    }
                </style>
            </head>

            <body>
                <div class="container">
                    <div class="header">
                        <h2>AR Digital Shop</h2>
                    </div>

                    <div class="products">
                        <div class="product">
                            <a href="${product.prolink_1}">
                                <img src="${product.imglink_1}" alt="Product 1">
                                <h3>${product.name_1}</h3>
                                <p>${product.price_1}</p>
                            </a>
                        </div>
                        <div class="product">
                            <a href="${product.prolink_2}">
                                <img src="${product.imglink_2}" alt="Product 2">
                                <h3>${product.name_2}</h3>
                                <p>${product.price_2}</p>
                            </a>
                        </div>
                        <div class="product">
                            <a href="${product.prolink_3}">
                                <img src="${product.imglink_3}" alt="Product 3">
                                <h3>${product.name_3}</h3>
                                <p>${product.price_3}</p>
                            </a>
                        </div>
                        <div class="product">
                            <a href="${product.prolink_4}">
                                <img src="${product.imglink_4}" alt="Product 4">
                                <h3>${product.name_4}</h3>
                                <p>${product.price_4}</p>
                            </a>
                        </div>
                        <div class="product">
                            <a href="${product.prolink_5}">
                                <img src="${product.imglink_5}" alt="Product 5">
                                <h3>${product.name_5}</h3>
                                <p>${product.price_5}</p>
                            </a>
                        </div>
                        <div class="product">
                            <a href="${product.prolink_6}">
                                <img src="${product.imglink_6}" alt="Product 6">
                                <h3>${product.name_6}</h3>
                                <p>${product.price_6}</p>
                            </a>
                        </div>
                    </div>

                    <div class="cta">
                        <a href="#">Shop Now</a>
                    </div>

                    <div class="footer">
                        <p>&copy; 2025 Crete E-Commerce | Unsubscribe</p>
                    </div>
                </div>
            </body>

            </html>
        `,
    });

    console.log('send mail', item);

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
    let CountMail = await EmailModel.countDocuments({ city: req.query.City, state: req.query.State }).populate('city').populate('state').exec()
    return res.json(CountMail)
}