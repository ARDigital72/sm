const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
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
});

const Admin = mongoose.model('admin', AdminSchema);
module.exports = Admin;
