import Redis from 'ioredis';

// Redis client singleton
let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    redis.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redis.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }

  return redis;
}

// Cache utilities
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const client = getRedisClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);
    
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, serialized);
    } else {
      await client.set(key, serialized);
    }
  },

  async del(key: string): Promise<void> {
    const client = getRedisClient();
    await client.del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  },

  async exists(key: string): Promise<boolean> {
    const client = getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  },

  async incr(key: string): Promise<number> {
    const client = getRedisClient();
    return await client.incr(key);
  },

  async expire(key: string, seconds: number): Promise<void> {
    const client = getRedisClient();
    await client.expire(key, seconds);
  },

  async ttl(key: string): Promise<number> {
    const client = getRedisClient();
    return await client.ttl(key);
  },
};

// Session management
export const session = {
  async create(userId: string, sessionData: any, ttlSeconds = 86400): Promise<string> {
    const sessionId = `session:${userId}:${Date.now()}`;
    await cache.set(sessionId, sessionData, ttlSeconds);
    return sessionId;
  },

  async get(sessionId: string): Promise<any | null> {
    return await cache.get(sessionId);
  },

  async destroy(sessionId: string): Promise<void> {
    await cache.del(sessionId);
  },

  async refresh(sessionId: string, ttlSeconds = 86400): Promise<void> {
    await cache.expire(sessionId, ttlSeconds);
  },
};

// Rate limiting
export const rateLimit = {
  async check(identifier: string, maxRequests: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const key = `ratelimit:${identifier}`;
    const client = getRedisClient();
    
    const current = await client.incr(key);
    
    if (current === 1) {
      await client.expire(key, windowSeconds);
    }
    
    const ttl = await client.ttl(key);
    const resetAt = Date.now() + (ttl * 1000);
    
    return {
      allowed: current <= maxRequests,
      remaining: Math.max(0, maxRequests - current),
      resetAt,
    };
  },

  async reset(identifier: string): Promise<void> {
    const key = `ratelimit:${identifier}`;
    await cache.del(key);
  },
};

// Pub/Sub for real-time features
export const pubsub = {
  async publish(channel: string, message: any): Promise<void> {
    const client = getRedisClient();
    await client.publish(channel, JSON.stringify(message));
  },

  subscribe(channel: string, callback: (message: any) => void): Redis {
    const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    subscriber.subscribe(channel);
    subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        try {
          const parsed = JSON.parse(msg);
          callback(parsed);
        } catch (error) {
          console.error('Error parsing pubsub message:', error);
        }
      }
    });

    return subscriber;
  },
};

// Queue management for background jobs
export const queue = {
  async enqueue(queueName: string, job: any): Promise<void> {
    const client = getRedisClient();
    await client.rpush(`queue:${queueName}`, JSON.stringify(job));
  },

  async dequeue(queueName: string): Promise<any | null> {
    const client = getRedisClient();
    const data = await client.lpop(`queue:${queueName}`);
    return data ? JSON.parse(data) : null;
  },

  async queueLength(queueName: string): Promise<number> {
    const client = getRedisClient();
    return await client.llen(`queue:${queueName}`);
  },
};

export default getRedisClient;
