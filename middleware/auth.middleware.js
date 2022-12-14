const jwt = require('jsonwebtoken');
// Utilisation dotenv
const dotenv = require('dotenv');
dotenv.config();
const TOKEN_SECRET = process.env.MONGOLAB_TOKEN;

module.exports.requireAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, TOKEN_SECRET);
        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;
        req.auth = {
            userId: userId,
            isAdmin : isAdmin
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};