const responseData = require('../middleware/response')

function adminOnly(req, res, next) {
    if (!req.userId) {
        return responseData(res, 'error', 403, "No Access", [], '');
    }

    if (req.userId !== "empireclothing_4821") {
        return responseData(res, 'error', 403, "No Access", [], '');
    }

    console.log(req.userId)
    next();
}

module.exports = adminOnly;
