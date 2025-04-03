const Error = require('../models/Error'); // Import Error Model

const userAccessMiddleware = async (req, res, next) => {
    try {
        if (req.user) {
            let UserError = (await Error.findOne({ user: req.user.id })).error
            // switch (UserError) {
            //     case 200:
            //         return next()

            //     case 400:
            //         return res.render('layouts/error_400')

            //     case 403:
            //         return res.render('layouts/error_403')

            //     case 404:
            //         return res.render('layouts/error_404')

            //     case 500:
            //         return res.render('layouts/error_500')

            //     default:
            //         return res.redirect('/loginpage');
            // }
            if(UserError == 200){
                return next()
            }else{
                return res.render('layouts/Error',{UserError})
            }
        } else {
            console.log('User Not Login');
            return res.redirect('/loginpage');
        }


    } catch (err) {
        console.log(err);
        res.redirect('back')
    }
};

module.exports = userAccessMiddleware;
