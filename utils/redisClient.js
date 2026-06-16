const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

const client = redis.createClient({ url: REDIS_URL });

client.on('error', (err) => {
    console.error('Redis client error:', err);
});

const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
        console.log(`Connected to Redis at ${REDIS_URL}`);
    }
};

module.exports = {
    client,
    connectRedis,
};
