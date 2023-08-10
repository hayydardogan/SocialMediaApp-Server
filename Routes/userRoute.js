const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

const userController = require("../Controller/userController")


router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));


// Giriş yapan kullanıcı bilgisini alma
router.get("/getUserInfo", userController.getUserInfo)


// Kullanıcı bilgilerini nick üzerinden alma (Profile sayfası için)
router.get("/getUserInfoByNick/:nick", userController.getUserInfoByNick)

// Kullanıcı şifre değiştirme işlemleri
router.put("/changePassword/:userID&:newPass", userController.changePassword)

// Kullanıcı bilgi güncelleme işlemleri
router.put("/updateUserInfo", userController.updateUserInfo)

// Arama sayfası işlemleri
router.get("/searchUser/:text", userController.searchUser)


module.exports = router