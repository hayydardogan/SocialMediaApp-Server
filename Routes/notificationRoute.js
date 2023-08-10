const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

const notificationController = require("../Controller/notificationController")


router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));


// Bildirim silme işlemi
router.put("/deleteNotification/:ntfID", notificationController.deleteNotification);

// Okunmayan bildirimlerin sayısı 
// Navbar'da bildirim butonuna uyarı eklemek için
router.get("/getUnreadNotification/:userID", notificationController.getUnreadNotification);

// Bildirimleri alma
router.get("/getNotifications/:owner", notificationController.getNotifications)

// Bildirimler görüntülendiğinde okundu olarak işaretleme
router.put("/readNotification/:userID", notificationController.readNotification)


module.exports = router