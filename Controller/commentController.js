const commentModel = require('../Model/commentModel');
const postModel = require('../Model/postModel');
const notificationModel = require('../Model/notificationModel');

const deleteComment = async (req, res) => {
    let { commentID } = req.params;
    try {
        const comment = await commentModel.findById(commentID);
        comment.commentIsActive = false;
        comment.save();
        res.status(200).send("Deleted");
    } catch (error) {
        console.log("There is an error : " + error.message);
    }
}

const toComment = async (req, res) => {

    try {
        // Yorum yapan kullanıcı id
        let sender_id = req.body.newComment.commentOwner;

        // Yorumu oluşturduk
        req.body.newComment.commentDate = new Date().getTime();
        req.body.newComment.commentIsActive = true;
        const comment = await commentModel.create(req.body.newComment);


        // Yorum yapılan gönderi sahibinin id değerini aldık
        const data = await postModel.find({ "_id": comment.commentPost }).populate({ path: "postOwner", select: ["_id"] });
        const owner_id = data[0].postOwner._id;

        if (sender_id != owner_id) {
            // Bildirimimizi oluşturalım
            const notification = new notificationModel({
                notificationOwner: owner_id,
                notificationSender: sender_id,
                notificationContent: ", gönderine yorum yaptı.",
                notificationIsActive: true,
                notificationIsRead: false,
                notificationDate: new Date().getTime(),
                isPostNotification: true,
                postID: req.body.newComment.commentPost
            })
            await notification.save();
        }



        res.status(200).json(comment);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const getComment = async (req, res) => {
    try {
        let { postID } = req.params;
        const comments = await commentModel.find({ "commentPost": postID, "commentIsActive": true }).populate({ path: "commentOwner", select: ["userName", "userSurname", "userImage"] }).sort({ commentDate: -1 })
        res.status(200).json(comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const getCommentCount = async (req, res) => {
    try {
        let { postID } = req.params;
        const count = await commentModel.find({ "commentPost": postID, "commentIsActive": true }).count();
        res.status(200).json({ "count": count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    deleteComment,
    toComment,
    getComment,
    getCommentCount
}