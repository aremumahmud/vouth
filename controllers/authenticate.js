const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];
    // console.log(req.header('Authorization'))
    if (!token) {
        return res.status(401).json({ error: true, sucess: false, message: 'Unauthorized' });
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: true, sucess: false, message: 'Forbidden' });
        }

        req.userId = user.userId;
        next();
    });
}

module.exports = authenticateJWT;