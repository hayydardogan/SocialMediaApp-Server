const notificationModel = require('../Model/notificationModel');

const deleteNotification = async (req, res) => {
    let { ntfID } = req.params;
    try {
        const notificaiton = await notificationModel.findById(ntfID);
        notificaiton.notificationIsActive = false;
        notificaiton.save();
        res.status(200).send("Deleted");
    } catch (error) {
        console.log("There is an error : " + error.message);
    }
}

const getUnreadNotification = async (req, res) => {
    let { userID } = req.params;
    let count = await notificationModel.find({ notificationOwner: userID, notificationIsRead: false }).count();

    res.status(200).send({
        count: count
    })
}

const getNotifications = async (req, res) => {
    try {
        let { owner } = req.params;
        const notifications = await notificationModel.find({ notificationOwner: owner, notificationIsActive: true }).populate({ path: "notificationSender", select: ["userName", "userSurname", "userImage", "_id", "userNick"] }).sort({ notificationDate: -1 });
        res.status(200).json({
            notifications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const readNotification = async (req, res) => {
    let { userID } = req.params;
    await notificationModel.updateMany({ notificationOwner: userID, notificationIsActive: true, notificationIsRead: false }, { $set: { notificationIsRead: true } });
    res.status(200).send();
}


module.exports = {
    deleteNotification,
    getUnreadNotification,
    getNotifications,
    readNotification
}