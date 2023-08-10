const userModel = require('../Model/userModel');
const jwt = require('jsonwebtoken');
const getUserInfo = (req, res, next) => {
    let token = req.headers.token;
    jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Oturum açılmadı."
            })
        }

        // Token doğrulaması başarılıysa kullanıcıyı bul
        const user = await userModel.findOne({ _id: decoded.userId });

        if (!user) return console.log("There is an error.");

        return res.status(200).json({
            user
        })


    })
}

const getUserInfoByNick = async (req, res) => {
    let { nick } = req.params;
    // console.log(nick);
    let user = await userModel.findOne({ userNick: nick });
    if (!user) return console.log("There is an error");


    return res.status(200).json({
        user
    });
}

const changePassword = async (req, res) => {

    let { userID, newPass } = req.params;

    // Kullanıcı parolasını şifreleyelim
    newPass = await bcrypt.hash(newPass, 10)

    const user = await userModel.findById(userID);
    user.userPassword = newPass;
    user.save();

    res.status(200).send("Success");
}

const updateUserInfo = async (req, res) => {

    const user = await userModel.findById(req.body.newInfo.userID);

    user.userName = req.body.newInfo.userName,
        user.userSurname = req.body.newInfo.userSurname,
        user.userNick = req.body.newInfo.userNick,
        user.userBiography = req.body.newInfo.userBiography,
        user.userImage = req.body.newInfo.userImage,
        user.userEmail = req.body.newInfo.userEmail,
        user.userCoverImage = req.body.newInfo.userCoverImage

    user.save();

    res.status(200).send("Success");
}

const searchUser = async (req, res) => {
    let { text } = req.params;

    const users = await userModel.find();
    const result = users.filter(x => x.userNick.toLowerCase().includes(text.toLowerCase()) || x.userName.toLowerCase().includes(text.toLowerCase()) || x.userSurname.toLowerCase().includes(text.toLowerCase()));

    res.status(200).send({
        result: result
    })

}

module.exports = {
    getUserInfo,
    getUserInfoByNick,
    changePassword,
    updateUserInfo,
    searchUser
}