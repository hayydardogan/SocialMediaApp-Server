const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notificationOwner: {
        required: true,
        type: String
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
    }
    
})

module.exports = mongoose.model('notificationInfo', notificationSchema)