const express = require("express")
const router = express.Router()

const auth = require("../middleware/auth");

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userModel = require('../Model/userModel');
const postModel = require('../Model/postModel');
const messageModel = require('../Model/messageModel');
const commentModel = require('../Model/commentModel');
const notificationModel = require('../Model/notificationModel');
const followerRelationModel = require('../Model/followerRelationModel');
const likeModel = require('../Model/likeModel');


router.get("/", (req, res) => {
    res.send("Anasayfa");
});

router.post("/welcome", auth, async (req, res) => {
    res.status(200).send("welcome bro");

    //res.status(200).send("your token is : " + req.user.userID)
})

// Kayıt olma işlemleri
router.post("/addNewUser", async (req, res) => {
    const { userEmail } = req.body;
    const isExist = await userModel.findOne({ userEmail });
    if (isExist) {
        return res.status(409).send("Bu e-posta adresi sistemde zaten kayıtlı.");
    }

    //Kullanıcı parolasını şifreleyelim
    req.body.userPassword = await bcrypt.hash(req.body.userPassword, 10);

    // Default olarak kullanıcı hesabını aktif ayarlayalım
    req.body.userIsActive = true;

    try {

        const user = await userModel.create(req.body);

        // Token oluşturalım
        const token = jwt.sign(
            { userID: user._id, userEmail },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // Token kaydetme
        user.userToken = token;



        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Login işlemleri
router.post("/login", async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // Böyle bir kullanıcı var mı ?
        const user = await userModel.findOne({ userEmail });

        if (user && (await bcrypt.compare(userPassword, user.userPassword))) {
            // Token oluşturma
            const token = jwt.sign(
                { userID: user._id, userEmail },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // Token kayıt etme
            user.userToken = token;

            
            res.status(200).json(user);
        }
        res.status(400).send("Hatalı giriş bilgileri.");
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Yeni paylaşım yapma işlemi
router.post("/addNewPost", auth , async (req, res) => {
    try {
        const post = await postModel.create(req.body);
        res.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Bir kullanıcının diğer bir kullanıcıya mesaj gönderme işlemi
router.post("/sendMessage", async (req, res) => {
    try {
        const message = await messageModel.create(req.body);
        res.status(200).json(message);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// İlgili gönderiye yorum yapma işlemi
router.post("/toComment", async (req, res) => {
    try {
        req.body.commentDate = new Date();
        req.body.commentIsActive = true;
        const comment = await commentModel.create(req.body);
        res.status(200).json(comment);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Bir etkileşim sonucunda (beğeni, yorum, takip ..) ilgili kullanıcıya bildirim gönderme işlemi
router.post("/sendNotification", async (req, res) => {
    try {
        const notification = await notificationModel.create(req.body);
        res.status(200).json(notification);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Bir kullanıcıyı takip etme işlemleri
router.post("/addFollowerRelation", async (req, res) => {
    try {
        const relation = await followerRelationModel.create(req.body);
        res.status(200).json(relation);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

//Bir paylaşımı beğenme işlemleri
router.post("/toLike", async (req, res) => {
    try {
        const like = await likeModel.create(req.body);
        res.status(200).json(like);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

//Post ID değerine göre paylaşımın beğeni sayısını getirir
router.get("/getLikeCount/:postID", auth, async (req, res) => {
    try {
        let { postID } = req.params;
        const count = await likeModel.find({ "postID": postID }).count();
        res.status(200).json({ "count": count , "user" : req.user.userID});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

//Post ID değerine göre paylaşıma yapılan yorumları getirir
router.get("/getComment/:postID", async (req, res) => {
    try {
        let { postID } = req.params;
        const comments = await commentModel.find({ "commentPost": postID })
        res.status(200).json(comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Post ID değerine göre paylaşıma yapılan yorum sayısını getirir
router.get("/getCommentCount/:postID", async (req, res) => {
    try {
        let { postID } = req.params;
        const count = await commentModel.find({ "commentPost": postID }).count();
        res.status(200).json({ "count": count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Gönderici ID ve alıcı ID değerlerine göre mesajların getirilmesi
router.get("/getMessages/:messageReceiver&:messageSender", async (req, res) => {
    let { messageReceiver, messageSender } = req.params;
    try {
        const messages = await messageModel.find({ "messageReceiver": messageReceiver, "messageSender": messageSender || "messageReceiver" });
        res.status(200).json(messages);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;