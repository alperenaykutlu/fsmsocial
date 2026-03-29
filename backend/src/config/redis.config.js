import Redis from "ioredis";

const isRedisEnabled = process.env.REDIS_ENABLED === 'true' || process.env.REDIS_HOST;

let pub = null;
let sub = null;

if (isRedisEnabled) {
    pub = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times) => Math.min(times * 50, 2000)
    });

    sub = pub.duplicate();

    pub.on('error', (err) => console.error('[redis pub]', err));
    sub.on('error', (err) => console.error('[redis sub]', err));
} else {
    console.warn("Uyarı: Redis pub/sub devre dışı. Socket.IO bellek adaptörü (in-memory) kullanacak.");
}

export { pub, sub, isRedisEnabled };