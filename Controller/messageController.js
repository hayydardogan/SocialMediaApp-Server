const messageModel = require("../Model/messageModel")


const sendMessage = async (req, res) => {
    try {
        const message = await messageModel.create(req.body);
        res.status(200).json(message);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const getMessages = async (req, res) => {
    let { messageReceiver, messageSender } = req.params;
    try {
        const messages = await messageModel.find({ "messageReceiver": messageReceiver, "messageSender": messageSender || "messageReceiver" });
        res.status(200).json(messages);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    sendMessage,
    getMessages
}