import {Redis} from '@upstash/redis';

export const redis = new Redis({
    url: process.env.NEXT_UPSTASH_REDIS_REST_URL,
    token: process.env.NEXT_UPSTASH_REDIS_REST_TOKEN,
})
