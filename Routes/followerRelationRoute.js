const cors = require('cors');
const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

router.options("*", cors());
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));

const followerRelationController = require("../Controller/followerRelationController")
const followerRelationModel = require("../Model/followerRelationModel")

// Takipçi ve takip edilen sayısı bulma
router.get("/getFollowCount/:id", followerRelationController.getFollowCount)

// X - Y 'yi takip ediyor mu ?
router.get("/getFollowerRelation/:activeID&:profileID", async (req, res) => {
    let { activeID, profileID } = req.params;
    const relation = await followerRelationModel.find({ followingUser: activeID, followerUser: profileID }).count();
    if (relation > 0) {
        res.status(200).send({
            result: true
        })
    } else {
        res.status(200).send({
            result: false
        })
    }
})

// Bir kullanıcıyı takip etme işlemleri
router.post("/addFollowerRelation/:followingID&:followerID", followerRelationController.addFollowerRelation)

// Bir kullanıcıyı takipten çıkarma işlemleri
router.delete("/removeFollowerRelation/:followingID&:followerID", followerRelationController.removeFollowerRelation)


module.exports = router