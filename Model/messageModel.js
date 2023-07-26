const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    messageReceiver: {
        required: true,
        type: String
    },
    messageSender: {
        required: true,
        type: String
    },
    messageContent: {
        required: true,
        type: String
    },
    messageDate: {
        required: true,
        type: Date
    },
    messageIsRead: {
        required: true,
        type: Boolean
    },
    messageIsActive: {
        required: true,
        type: Boolean
    }
    
})

module.exports = mongoose.model('messageInfo', messageSchema)