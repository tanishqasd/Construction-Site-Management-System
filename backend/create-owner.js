const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
require('dotenv').config({ quiet: true });
const User = require('./models/User');
async function main() {
  const { OWNER_NAME:name, OWNER_EMAIL:email, OWNER_PASSWORD:password, MONGO_URI:uri } = process.env;
  if (!uri || !name?.trim() || !email || !isEmail(email) || !password || password.length < 8 || Buffer.byteLength(password,'utf8') > 72) throw new Error('Set MONGO_URI, OWNER_NAME, OWNER_EMAIL and an OWNER_PASSWORD of 8–72 bytes privately in the environment.');
  await mongoose.connect(uri,{serverSelectionTimeoutMS:10000});
  if (await User.exists({email:email.trim().toLowerCase()})) throw new Error('An account with this email already exists. No account was changed.');
  await User.create({name:name.trim(),email:email.trim().toLowerCase(),password:await bcrypt.hash(password,12),role:'owner'});
  console.log('Owner account created. Sign in and create your sites and team accounts.');
}
main().catch(error=>{console.error(error.name==='Error'&&!error.code?error.message:'Owner setup failed. Check the database connection and account details.');process.exitCode=1;}).finally(async()=>{delete process.env.OWNER_PASSWORD;await mongoose.disconnect();});
