const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentOwner: {
        required: true,
        type: String
    },
    commentContent: {
        required: true,
        type: String
    },
    commentPost: {
        required: true,
        type: String
    },
    commentDate: {
        required: true,
        type: Date
    },
    commentIsActive: {
        required: true,
        type: Boolean
    }
    
})

module.exports = mongoose.model('commentInfo', commentSchema)