const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Please sign in to continue.' });
  let decoded;
  try { decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET); }
  catch { return res.status(401).json({ message: 'Your session has expired. Please sign in again.' }); }
  try {
    const user = await User.findById(decoded.id).select('-password +tokenVersion');
    if (!user || user.active === false) return res.status(401).json({ message: 'This account is no longer active.' });
    if ((decoded.version || 0) !== (user.tokenVersion || 0)) return res.status(401).json({ message: 'Your account credentials changed. Please sign in again.' });
    req.user = { ...user.toObject(), id: String(user._id) };
    delete req.user.tokenVersion;
    delete req.user.password;
    if (user.mustChangePassword && !['/me','/user/profile','/user/password'].includes(req.path)) return res.status(403).json({ message: 'Change your temporary password before accessing site records.', code: 'PASSWORD_CHANGE_REQUIRED' });
    next();
  } catch (error) { next(error); }
};
