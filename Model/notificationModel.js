const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notificationOwner: {
        required: true,
        type: mongoose.Schema.ObjectId, ref: 'userInfo'
    },
    notificationSender: {
        required: true,
        type: mongoose.Schema.ObjectId, ref: 'userInfo'
    },
    notificationContent: {
        required: true,
        type: String
    },
    notificationDate: {
        required: true,
        type: Date
    },
    notificationIsActive: {
        required: true,
        type: Boolean
    },
    notificationIsRead: {
        required: true,
        type: Boolean
    },
    isPostNotification: {
        required: true,
        type: Boolean
    },
    postID: {
        type: String
    }

})

module.exports = mongoose.model('notificationInfo', notificationSchema)