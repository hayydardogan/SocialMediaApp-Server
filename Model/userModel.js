const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        required: true,
        type: String
    },
    userSurname: {
        required: true,
        type: String
    },
    userEmail: {
        required: true,
        type: String
    },
    userNick: {
        required: true,
        type: String
    },
    userBiography: {
        required: true,
        type: String
    },
    userPassword: {
        required: true,
        type: String
    },
    userImage: {
        type: String
    },
    userCoverImage:{
        type: String
    },
    userIsActive: {
        required: true,
        type: Boolean
    }
})

module.exports = mongoose.model('userInfo', userSchema)