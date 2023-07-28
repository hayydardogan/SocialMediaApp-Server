const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postOwner: {
        required: true,
        type: String
    },
    postContent: {
        required: true,
        type: String
    },
    postDate: {
        required: true,
        type: Date,
        default: new Date
    },
    postIsActive: {
        required: true,
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('postInfo', postSchema)