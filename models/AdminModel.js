const mongose = require('mongoose')

const path = require('path')

const multer = require('multer')
const { type } = require('os')

const imgpath = '/uploads/user'

const AdminSchma = mongose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    key: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    image: {
        type: String
    },
    twitter: {
        type: String
    },
    facebook: {
        type: String
    },
    instagram: {
        type: String
    },
    status: {
        type: String
    }
}, {
    timestamps: true
})

const uploadimg = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, path.join(__dirname, '..', imgpath))
    },
    filename: (req, file, cd) => {
        cd(null, file.fieldname + '-' + Date.now())
    }
})

AdminSchma.statics.uploadimg = multer({ storage: uploadimg }).single('image')
AdminSchma.statics.imgpath = imgpath

const admin = mongose.model('admin', AdminSchma)

module.exports = admin