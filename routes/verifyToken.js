const jwt = require('jsonwebtoken');
const UserLogin = require('../models/UserLogin');

module.exports = async function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send({ status: 'error', statusCode: 401, message: 'Unauthorized' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const userLogin = await UserLogin.findOne({ username: verified.username });

        if (userLogin) {
            req.user = verified;
            next();
        } else {
            return res.status(401).send({ status: 'error', statusCode: 401, message: 'You are not logged in ;) Where did you get this token?' });
        }

    } catch (err) {
        return res.status(401).send({ status: 'error', statusCode: 401, message: 'Invalid token' });
    }
}

