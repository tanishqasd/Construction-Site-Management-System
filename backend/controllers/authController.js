const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');

const createToken = (user) => jwt.sign(
  { id: user._id, role: user.role, version: user.tokenVersion || 0 },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const register = async (req, res) => {
  try {
    if (process.env.ALLOW_OWNER_REGISTRATION !== 'true') return res.status(403).json({ message: 'Contact your workspace owner for an account.' });
    const { name, password, role = 'owner', email: suppliedEmail } = req.body || {};
    const email = typeof suppliedEmail === 'string' ? suppliedEmail.trim().toLowerCase() : '';
    if (typeof name !== 'string' || !name.trim() || name.length > 120 || !isEmail(email) || typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Name, email and a password of at least 8 characters are required.' });
    }
    if (role !== 'owner') {
      return res.status(403).json({ message: 'Create an owner workspace first. The owner creates manager and worker accounts in Team access.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      organizationId: user.organizationId || user._id,
      assignedSites: user.assignedSites || [],
    };

    res.status(201).json({
      message: "User Registered Successfully",
      token: createToken(user),
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.code === 11000 ? 'An account with this email already exists.' : 'Could not create your account. Please try again.',
    });
  }
};

const login = async (req, res) => {
  try {
    const { password, email: suppliedEmail } = req.body || {};
    const email = typeof suppliedEmail === 'string' ? suppliedEmail.trim().toLowerCase() : '';
    if (!isEmail(email) || typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+tokenVersion');

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }
    if (user.active === false) return res.status(403).json({ message: 'This account has been disabled. Contact your workspace owner.' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    if (user.active === false) return res.status(403).json({ message: 'This account has been disabled. Contact your workspace owner.' });

    const token = createToken(user);

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId || user._id,
        assignedSites: user.assignedSites || [],
        mustChangePassword: user.mustChangePassword || false,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Could not sign you in. Please try again.',
    });
  }
};

module.exports = {
  register,
  login,
};
