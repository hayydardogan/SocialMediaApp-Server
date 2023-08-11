const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));

const likeController = require("../Controller/likeController")

// Post ID değerine göre paylaşımın beğeni sayısını getirir
router.get("/getLikeCount/:postID", likeController.getLikeCount)

// Gönderiyi beğenme işlemleri
router.post("/likePost", likeController.likePost)

// Beğenmekten vazgeçme işlemleri
router.delete("/dislikePost/:userID&:postID", likeController.dislikePost)

// Kullanıcı beğendi mi beğenmedi mi öğrenme işlemleir
router.get("/getLikeStatus/:userID&:postID", likeController.getLikeStatus)

module.exports = router