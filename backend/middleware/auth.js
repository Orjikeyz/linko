const jwt = require('jsonwebtoken');
const responseData = require('../middleware/response')


const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(token)
    if (!token) return responseData(res, 'error', 401, "Unauthorized", [], '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.tokenId = decoded.id; // attach user info to request
        next();
    } catch (err) {
        return responseData(res, 'error', 401, "Invalid or expired token", [], '');
    }
};

module.exports = authenticate;