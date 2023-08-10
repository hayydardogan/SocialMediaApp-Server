const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

const postController = require("../Controller/postController")


router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));


// Yeni paylaşım yapma işlemi
router.post("/addNewPost", postController.addNewPost)

// Gönderi silme işlemleri
router.post("/deletePost/:postID", postController.deletePost)

// Kullanıcının takip ettiği kişilerin paylaşımlarını çekme
// Şimdilik tüm verileri çekiyoruz
router.get("/getPosts/:userID", postController.getPosts)

// Kullanıcının kendi paylaşmış olduğu gönderileri çekme
// Profile sayfasında göstermek için
router.get("/getMyPosts/:po", postController.getMyPosts)

// Post detaylarını çekme
router.get("/getPostInfo/:postID", postController.getPostInfo)



module.exports = router