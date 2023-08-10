const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));

const likeController = require("../Controller/likeController")

//Bir paylaşımı beğenme işlemleri
router.post("/toLike", likeController.toLike)

//Post ID değerine göre paylaşımın beğeni sayısını getirir
router.get("/getLikeCount/:postID", likeController.getLikeCount)

module.exports = router