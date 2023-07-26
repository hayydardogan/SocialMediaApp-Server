const mongoose = require('mongoose');

const followerRelationSchema = new mongoose.Schema({
    // Takip edilen kişi
    followingUser: {
        required: true,
        type: String
    },
    // Takip eden kişi
    followerUser: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('followerRelationInfo', followerRelationSchema)