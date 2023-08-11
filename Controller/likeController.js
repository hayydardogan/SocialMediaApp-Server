
const likeModel = require("../Model/likeModel")
const notificationModel = require('../Model/notificationModel')
const postModel = require('../Model/postModel')
const bodyParser = require("body-parser")

const getLikeCount = async (req, res) => {
    try {
        let { postID } = req.params;
        const count = await likeModel.find({ "postID": postID }).count();
        res.status(200).json({ "count": count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const likePost = async (req, res) => {
    // Beğeni işlemi tamamlandı
    await likeModel.create(req.body.data);

    // Gönderi sahibini bulalım
    let post = await postModel.findById(req.body.data.postID )
    let postOwner = post.postOwner;
    console.log(postOwner);

    if (postOwner != req.body.data.userID) {
        let notification = {
            notificationOwner: postOwner,
            notificationSender: req.body.data.userID,
            notificationContent: ", gönderini beğendi.",
            notificationDate: new Date().getTime(),
            notificationIsActive: true,
            notificationIsRead: false,
            isPostNotification: true,
            postID: post._id
        }
        await notificationModel.create(notification);
        res.status(200).send("Created")
    }
    else {
        res.status(200).send("Created")
    }
}

const dislikePost = async (req, res) => {
    let { postID, userID } = req.params;
    await likeModel.deleteOne({ postID: postID, userID: userID });
    res.status(200).send("Deleted");
}

const getLikeStatus = async (req, res) => {
    let { postID, userID } = req.params;
    let count = await likeModel.find({ postID: postID, userID: userID }).count();
    if (count > 0) {
        res.status(200).send({
            result: true
        })
    } else {
        res.status(200).send({
            result: false
        })
    }
}

module.exports = {
    getLikeCount,
    likePost,
    dislikePost,
    getLikeStatus
}