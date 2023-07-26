const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    // Beğenilen gönderi
    postID: {
        required: true,
        type: String
    },
    // Beğenen kişi
    userID: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('likeInfo', likeSchema)