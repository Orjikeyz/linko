const requests = {};
const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    const reqLimit = 5;
    const timeWindow = 60 * 1000; // 1 minute
    const now = Date.now();

    if (!requests[ip]) {
        requests[ip] = {
            count: 1,
            startTime: now
        };
        return next();
    }

    let data = requests[ip];

    // Reset window
    if (now - data.startTime > timeWindow) {
        requests[ip] = {
            count: 1,
            startTime: now
        };
        return next();
    }

    // Block request
    if (data.count >= reqLimit) {
        return res.status(429).json({
            status: "error",
            message: "Too many requests. Try again later."
        });
    }

    // Increment count
    data.count++;
    requests[ip] = data;

    next();
};

module.exports = rateLimiter