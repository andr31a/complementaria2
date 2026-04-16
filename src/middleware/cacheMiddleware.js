const redisClient = require('../lib/redis');

const checkCache = (keyPrefix) => {
  return async (req, res, next) => {
    try {
      const key = `${keyPrefix}:${req.originalUrl}`;
      const data = await redisClient.get(key);

      if (data) {
        return res.status(200).json(JSON.parse(data));
      }

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (body.success) {
          redisClient.setEx(key, 3600, JSON.stringify(body));
        }
        originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Redis cache error:', err);
      next();
    }
  };
};

const clearCache = (keyPrefix) => {
  return async (req, res, next) => {
    try {
      const keys = await redisClient.keys(`${keyPrefix}:*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err) {
      console.error('Redis cache clear error:', err);
    }
    next();
  };
};

module.exports = {
  checkCache,
  clearCache
};
