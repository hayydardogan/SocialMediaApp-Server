const express = require("express")
const router = express.Router()
const cors = require('cors');

const { default: mongoose } = require("mongoose");


router.options("*", cors());
router.use(cors());

router.get("/", (req, res) => {
    res.send("Anasayfa");
});




module.exports = router;