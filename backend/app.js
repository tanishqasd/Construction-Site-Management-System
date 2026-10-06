const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options':'nosniff', 'X-Frame-Options':'DENY', 'Referrer-Policy':'strict-origin-when-cross-origin', 'Cache-Control':'no-store' });
  next();
});
const origins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'https://maple-construction-app-zeta.vercel.app',
  ...(process.env.FRONTEND_URL || '').split(','),
].map((origin) => origin.trim().replace(/\/+$/, '')).filter(Boolean);

app.use(cors({
  origin: origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '4mb' }));

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  });
});

// Route errors must fail startup instead of returning a false successful response.
app.use('/', require('./routes/homeRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/operationsRoutes'));

app.use((req, res) => res.status(404).json({ message: 'API route not found' }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(error.status || 500).json({ message: error.status === 400 ? 'Invalid JSON request' : error.status === 413 ? 'Request is too large. Files must be 2 MB or smaller.' : 'Internal server error' });
});

module.exports = app;
