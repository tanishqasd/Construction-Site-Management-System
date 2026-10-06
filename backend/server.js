const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config({ quiet: true });
const app = require('./app');

async function start() {
  for (const name of ['MONGO_URI', 'JWT_SECRET']) {
    if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
  }
  if (Buffer.byteLength(process.env.JWT_SECRET, 'utf8') < 32) throw new Error('JWT_SECRET must contain at least 32 random bytes.');
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, '0.0.0.0', () => console.log(`API listening on port ${port}`));
}

start().catch((error) => {
  const code = error.code === 'ENOTFOUND' ? 'DATABASE_DNS_FAILED' : 'CONFIGURATION_OR_DATABASE_FAILED';
  console.error(`API startup failed (${code}). Check the database hostname, network access and JWT_SECRET (minimum 32 bytes).`);
  process.exit(1);
});
