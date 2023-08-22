const userModel = require('../Model/userModel');
const bcrypt = require('bcrypt');
const addNewUser = async (req, res) => {
    const { userEmail, userNick } = req.body;

    const isExistEmail = await userModel.findOne({ userEmail });
    if (isExistEmail) {
        return res.status(200).json({ result: "email"});
    }

    const isExistNick = await userModel.findOne({ userNick });
    if (isExistNick) {
        return res.status(200).json({ result: "usernick" });
    }

    // Kullanıcı parolasını şifreleyelim
    req.body.userPassword = await bcrypt.hash(req.body.userPassword, 10)

    // Default olarak kullanıcı hesabını aktif ayarlayalım
    req.body.userIsActive = true;

    try {
        req.body.userImage = "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg";
        req.body.userCoverImage = "https://flowbite.com/docs/images/examples/image-3@2x.jpg"
        await userModel.create(req.body);

        res.status(200).json({ result : true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addNewUser
}