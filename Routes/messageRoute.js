const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

const messageController = require("../Controller/messageController")


router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));


// Bir kullanıcının diğer bir kullanıcıya mesaj gönderme işlemi
router.post("/sendMessage", messageController.sendMessage)


// Gönderici ID ve alıcı ID değerlerine göre mesajların getirilmesi
router.get("/getMessages/:messageReceiver&:messageSender", messageController.getMessages)



module.exports = router