const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// 파일 업로드 요청 제한
const uploadLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: 'rate:upload:'
  }),
  windowMs: 60 * 60 * 1000, // 1시간
  max: 100, // IP당 100회
  message: {
    success: false,
    message: '너무 많은 파일 업로드 요청이 있었습니다. 잠시 후 다시 시도해주세요.'
  }
});

// 파일 조회 요청 제한
const retrieveLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: 'rate:retrieve:'
  }),
  windowMs: 15 * 60 * 1000, // 15분
  max: 300, // IP당 300회
  message: {
    success: false,
    message: '너무 많은 파일 조회 요청이 있었습니다. 잠시 후 다시 시도해주세요.'
  }
});

module.exports = {
  uploadLimiter,
  retrieveLimiter
};