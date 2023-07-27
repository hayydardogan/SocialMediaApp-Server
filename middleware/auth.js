const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.userToken || req.query.userToken || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("Bu sayfayı görebilmek için giriş yapmalısınız.");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
        console.log(req.user.userID)
    } catch (err) {
        return res.status(401).send("Geçersiz token.");
    }
    return next();
};

module.exports = verifyToken;