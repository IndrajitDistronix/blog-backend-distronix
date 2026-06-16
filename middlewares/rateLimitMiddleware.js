const { client } = require('../utils/redisClient');

const getClientKey = (req) => {
    return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
};

const createRateLimiter = ({ windowSeconds, max, message, prefix }) => {
    return async (req, res, next) => {
        const key = `${prefix}:${getClientKey(req)}`;

        try {
            const count = await client.incr(key);
            if (count === 1) {
                await client.expire(key, windowSeconds);
            }

            const ttl = await client.ttl(key);
            const retryAfter = ttl > 0 ? ttl : windowSeconds;

            res.set('X-RateLimit-Limit', max.toString());
            res.set('X-RateLimit-Remaining', Math.max(0, max - count).toString());
            res.set('X-RateLimit-Reset', (Math.floor(Date.now() / 1000) + retryAfter).toString());

            if (count > max) {
                return res.status(429).json({
                    message: message || 'Too many requests. Please try again later.',
                    retryAfter,
                });
            }

            next();
        } catch (err) {
            console.error('Redis rate limiter error:', err);
            next();
        }
    };
};

const globalRateLimiter = createRateLimiter({
    windowSeconds: 15 * 60,
    max: 100,
    prefix: 'rate:global',
    message: 'Too many requests from this IP, please try again later.',
});

const authRateLimiter = createRateLimiter({
    windowSeconds: 10 * 60,
    max: 10,
    prefix: 'rate:auth',
    message: 'Too many authentication requests, please slow down.',
});

module.exports = {
    globalRateLimiter,
    authRateLimiter,
};
