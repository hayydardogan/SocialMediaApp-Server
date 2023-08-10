const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

const commentController = require("../Controller/commentController")


router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));



// Yorum silme işlemleri
router.put("/deleteComment/:commentID", commentController.deleteComment)

// İlgili gönderiye yorum yapma işlemi
router.post("/toComment", commentController.toComment)

//Post ID değerine göre paylaşıma yapılan yorumları getirir
router.get("/getComment/:postID", commentController.getComment)

// Post ID değerine göre paylaşıma yapılan yorum sayısını getirir
router.get("/getCommentCount/:postID", commentController.getCommentCount)

module.exports = router