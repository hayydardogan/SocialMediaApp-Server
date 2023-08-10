const followerRelationModel = require('../Model/followerRelationModel');
const notificationModel = require("../Model/notificationModel")

const getFollowCount = async (req, res) => {
    let { id } = req.params;
    let followerCount = await followerRelationModel.find({ followerUser: id }).count();
    let followingCount = await followerRelationModel.find({ followingUser: id }).count();

    res.status(200).send({
        count: {
            followingCount: followingCount,
            followerCount: followerCount
        }
    })
}

const addFollowerRelation = async (req, res) => {
    try {
        let { followingID, followerID } = req.params;

        const relation = {
            followingUser: followingID,
            followerUser: followerID
        }
        await followerRelationModel.create(relation);
        let notification = {
            notificationOwner: followerID,
            notificationSender: followingID,
            notificationContent: ", seni takip etmeye başladı.",
            notificationDate: new Date().getTime(),
            notificationIsActive: true,
            notificationIsRead: false,
            isPostNotification: false,
        }
        await notificationModel.create(notification);
        res.status(200).send({
            result: true
        })
    } catch (error) {
        console.log("There is an error : " + error.message);
        res.status(200).send({
            result: false
        })
    }
}

const removeFollowerRelation = async (req, res) => {
    let { followingID, followerID } = req.params;

    let relation = await followerRelationModel.deleteOne({ followingUser: followingID, followerUser: followerID });
    res.status(200).send({
        result: true
    })
}

module.exports = {
    getFollowCount,
    addFollowerRelation,
    removeFollowerRelation
}