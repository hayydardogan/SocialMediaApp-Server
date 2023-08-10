const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

const registerController = require("../Controller/registerController")


router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));

// Kayıt olma işlemleri
router.post("/addNewUser", registerController.addNewUser)

module.exports = router;
