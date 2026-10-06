const attempts = new Map();
const windowMs = 15 * 60 * 1000;
function authLimiter(req, res, next) {
  const now = Date.now();
  if (attempts.size > 10000) for (const [key, entry] of attempts) if (entry.expires <= now) attempts.delete(key);
  const key = req.ip;
  let entry = attempts.get(key);
  if (!entry || entry.expires <= now) { entry = { count: 0, expires: now + windowMs }; attempts.set(key, entry); }
  entry.count++;
  if (entry.count > 20) {
    res.set('Retry-After', String(Math.ceil((entry.expires - now) / 1000)));
    return res.status(429).json({ message: 'Too many sign-in attempts. Please try again in 15 minutes.' });
  }
  next();
}
module.exports = { authLimiter };
