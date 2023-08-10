const userModel = require('../Model/userModel');
const bcrypt = require('bcrypt');
const addNewUser = async (req, res) => {
    const { userEmail } = req.body;

    const isExist = await userModel.findOne({ userEmail });
    if (isExist) {
        return res.status(200).json({ message: "Bu kullanıcı adı veya e-posta sistemde zaten kayıtlı." });
    }

    // Kullanıcı parolasını şifreleyelim
    req.body.userPassword = await bcrypt.hash(req.body.userPassword, 10)

    // Default olarak kullanıcı hesabını aktif ayarlayalım
    req.body.userIsActive = true;

    try {
        const user = await userModel.create(req.body);

        res.status(200).json({ result : true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addNewUser
}