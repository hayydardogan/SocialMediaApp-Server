const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

const loginController = require("../Controller/loginController")


router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));


// Login işlemleri
router.post("/login", loginController.login)

module.exports = router