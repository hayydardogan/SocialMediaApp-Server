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
        type: Date
    },
    postIsActive: {
        required: true,
        type: Boolean
    }
})

module.exports = mongoose.model('postInfo', postSchema)