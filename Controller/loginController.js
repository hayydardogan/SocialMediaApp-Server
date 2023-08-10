const userModel = require('../Model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser")
const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // Böyle bir kullanıcı var mı ?
        const user = await userModel.findOne({ userEmail });

        if (user && (await bcrypt.compare(userPassword, user.userPassword))) {

            let token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {

                expiresIn: '365d' // 365 gün sonra token süresi dolacak

            });
            return res.status(200).json({
                message: 'Başarılı bir şekilde giriş yaptınız. Lütfen bekleyin...',
                token: token
            })

        }
        res.status(201).json({ message: "E-Posta veya şifre hatalı." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    login
}