const express = require("express")
const router = express.Router()

const userModel = require('../Model/userModel');
const postModel = require('../Model/postModel');
const messageModel = require('../Model/messageModel');
const commentModel = require('../Model/commentModel');
const notificationModel = require('../Model/notificationModel');
const followerRelationModel = require('../Model/followerRelationModel');
const likeModel = require('../Model/likeModel');

router.get("/", (req, res) => {
    res.send("anasayfadasın");
});

router.post("/addNewUser", async (req, res) => {
    try {
        const user = await userModel.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

router.post("/addNewPost", async (req, res) => {
    try {
        const post = await postModel.create(req.body);
        res.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

router.post("/sendMessage", async (req, res) => {
    try {
        const message = await messageModel.create(req.body);
        res.status(200).json(message);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

router.post("/toComment", async (req, res) => {
    try {
        const comment = await commentModel.create(req.body);
        res.status(200).json(comment);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

router.post("/sendNotification", async (req, res) => {
    try {
        const notification = await notificationModel.create(req.body);
        res.status(200).json(notification);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

router.post("/addFollowerRelation", async (req, res) => {
    try {
        const relation = await followerRelationModel.create(req.body);
        res.status(200).json(relation);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

router.post("/toLike", async (req, res) => {
    try {
        const like = await likeModel.create(req.body);
        res.status(200).json(like);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;