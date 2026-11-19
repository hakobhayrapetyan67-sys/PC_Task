// Minimal in-memory rate limiter (no extra dependency).
// For production behind several instances, swap in express-rate-limit + Redis.
const buckets = new Map();

function rateLimit({ windowMs = 15 * 60 * 1000, max = 20, keyBy } = {}) {
  return (req, res, next) => {
    const key = keyBy ? keyBy(req) : `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const entry = buckets.get(key);

    if (!entry || now > entry.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        message: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} min.`,
      });
    }
    next();
  };
}

const sweep = setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
}, 60 * 1000);
sweep.unref();

// Exposed for tests
rateLimit.reset = () => buckets.clear();

export default rateLimit;
