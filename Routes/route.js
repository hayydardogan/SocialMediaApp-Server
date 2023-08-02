const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const auth = require("../middleware/auth");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb')
const userModel = require('../Model/userModel');
const postModel = require('../Model/postModel');
const messageModel = require('../Model/messageModel');
const commentModel = require('../Model/commentModel');
const notificationModel = require('../Model/notificationModel');
const followerRelationModel = require('../Model/followerRelationModel');
const likeModel = require('../Model/likeModel');
const { default: mongoose } = require("mongoose");

router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.get("/", (req, res) => {
    res.send("Anasayfa");
});

// Giriş yapan kullanıcı bilgisini alma
router.get("/getUserInfo", (req, res, next) => {
    let token = req.headers.token;
    jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Oturum açılmadı."
            })
        }

        // Token doğrulaması başarılıysa kullanıcıyı bul
        const user = await userModel.findOne({ _id: decoded.userId });

        if (!user) return console.log("There is an error.");

        return res.status(200).json({
            user
        })


    })
})

// Kullanıcı bilgilerini nick üzerinden alma (Profile sayfası için)
router.get("/getUserInfoByNick/:nick", async (req, res) => {
    let { nick } = req.params;
    // console.log(nick);
    let user = await userModel.findOne({ userNick: nick });
    if (!user) return console.log("There is an error");

    return res.status(200).json({
        user
    });
})

// Kayıt olma işlemleri
router.post("/addNewUser", async (req, res) => {
    const { userEmail } = req.body;

    const isExist = await userModel.findOne({ userEmail });
    if (isExist) {
        return res.status(200).json({ message: "Bu kullanıcı adı veya e-posta sistemde zaten kayıtlı." });
    }

    // Kullanıcı parolasını şifreleyelim
    req.body.userPassword = await bcrypt.hash(req.body.userPassword, 10)

    // Default olarak kullanıcı hesabını aktif ayarlayalım
    req.body.userIsActive = true;

    try {
        const user = await userModel.create(req.body);

        res.status(200).json({ message: "Başarılı bir şekilde kayıt oldunuz. Lütfen bekleyin...", clearInput: true });
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

            let token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {

                expiresIn: '1h' // 1 saat sonra token süresi dolacak

            });
            return res.status(200).json({
                message: 'Başarılı bir şekilde giriş yaptınız. Lütfen bekleyin...',
                token: token
            })

        }
        res.status(201).json({ message: "E-Posta veya şifre hatalı." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Yeni paylaşım yapma işlemi
router.post("/addNewPost", async (req, res) => {
    try {
        const post = await postModel.create(req.body);
        res.status(200).json({
            message: "Gönderi başarıyla paylaşıldı.",
            post: post
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Gönderi silme işlemleri
router.post("/deletePost/:postID", async (req, res) => {
    let { postID } = req.params;

    try {
        await postModel.findByIdAndDelete(postID);
        res.status(200).send("Deleted");
    } catch (error) {
        console.log("There is an error : " + error.message);
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

        // Yorum yapan kullanıcı id
        let id = req.body.newComment.commentOwner;

        // Yorumu oluşturduk
        req.body.newComment.commentDate = new Date().getTime();
        req.body.newComment.commentIsActive = true;
        const comment = await commentModel.create(req.body.newComment);


        // Yorum yapılan gönderi sahibinin id değerini aldık
        const data = await postModel.find({ "_id": comment.commentPost }).populate({ path: "postOwner", select: ["_id"] });
        const user_id = data[0].postOwner._id;


        // Bildirimimizi oluşturalım
        const notification = new notificationModel({
            notificationOwner: user_id,
            notificationContent: id + ", gönderine yorum yaptı.",
            notificationIsActive: true,
            notificationIsRead: false,
            notificationDate: new Date().getTime()
        })
        await notification.save();

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


// Kullanıcının takip ettiği kişilerin paylaşımlarını çekme
// Şimdilik tüm verileri çekiyoruz
router.get("/getPosts", async (req, res) => {
    const posts = await postModel.find().populate({ path: "postOwner", select: ["userName", "userSurname", "userImage", "_id", "userNick"] });

    res.status(200).json(posts);
})


// Kullanıcının kendi paylaşmış olduğu gönderileri çekme
// Profile sayfasında göstermek için
// Çalışmıyor güncelle burayı
router.get("/getMyPosts/:postOwner", async (req, res) => {
    let { postOwner } = req.params;
    res.send(postOwner)

    try {

        const posts = await postModel.$where({ "postOwner": postOwner });
        res.status(200).json({
            posts: posts
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

// Post detaylarını çekme
router.get("/getPostInfo/:postID", async (req, res) => {
    let { postID } = req.params;

    const post = await postModel.find({ _id: postID }).populate({ path: "postOwner", select: ["userName", "userSurname", "userImage", "_id", "userNick"] });

    if (!post) return res.status(404).json(
        {
            message: "Girilen ID değerine ait gönderi bulunamadı"
        }
    )


    return res.status(200).json({
        post
    })
})

//Post ID değerine göre paylaşımın beğeni sayısını getirir
router.get("/getLikeCount/:postID", async (req, res) => {
    try {
        let { postID } = req.params;
        const count = await likeModel.find({ "postID": postID }).count();
        res.status(200).json({ "count": count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
})

//Post ID değerine göre paylaşıma yapılan yorumları getirir
router.get("/getComment/:postID", async (req, res) => {
    try {
        let { postID } = req.params;
        const comments = await commentModel.find({ "commentPost": postID }).populate({ path: "commentOwner", select: ["userName", "userSurname", "userImage"] }).sort({ commentDate: -1 })
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