const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(400).send({ status: 'error', statusCode: 400, message: 'Unauthorized' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).send({ status: 'error', statusCode: 400, message: 'Invalid token' });
    }
}

