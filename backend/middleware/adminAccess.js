const responseData = require('../middleware/response')

function adminOnly(req, res, next) {
    if (!req.userId) {
        return responseData(res, 'error', 403, "No Access", [], '');
    }

    const ADMIN_IDS = [
        'blackforge',
        'empireclothing_4821'
    ];

    if (!ADMIN_IDS.includes(req.userId)) {
        console.log(ADMIN_IDS.includes(req.userId))
        return responseData(res, 'error', 403, 'No Access', [], '');
    }

    next();
}

module.exports = adminOnly;
