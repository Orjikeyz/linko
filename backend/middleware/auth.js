const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return responseData(res, 'error', 401, "Unauthorized", [], '');

    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) return responseData(res, 'error', 401, "Unauthorized", [], '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        return responseData(res, 'error', 401, "Invalid or expired token", [], '');
    }
};

module.exports = authenticate;