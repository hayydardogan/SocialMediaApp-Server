const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const auth = require("../middleware/auth");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../Model/userModel');
const postModel = require('../Model/postModel');
const messageModel = require('../Model/messageModel');
const commentModel = require('../Model/commentModel');
const notificationModel = require('../Model/notificationModel');
const followerRelationModel = require('../Model/followerRelationModel');
const likeModel = require('../Model/likeModel');

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
    let user = userModel.find({ userNick: nick });
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


// Kullanıcının takip ettiği kişilerin paylaşımlarını çekme
// Şimdilik tüm verileri çekiyoruz
router.get("/getPosts", async (req, res) => {
    const posts = await postModel.find().populate({ path: "postOwner", select: ["userName", "userSurname", "userImage"] });

    res.status(200).json(posts);
})

// Post detaylarını çekme
router.get("/getPostInfo/:postID", async (req, res) => {
    let { postID } = req.params;

    const post = await postModel.find({ _id: postID }).populate({ path: "postOwner", select: ["userName", "userSurname", "userImage"] });

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
router.get("/getLikeCount/:postID", auth, async (req, res) => {
    try {
        let { postID } = req.params;
        const count = await likeModel.find({ "postID": postID }).count();
        res.status(200).json({ "count": count, "user": req.user.userID });
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