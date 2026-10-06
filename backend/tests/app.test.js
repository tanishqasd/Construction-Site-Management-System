const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../app');
const User = require('../models/User');
const { register, login } = require('../controllers/authController');

let server;
let base;
test.before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => new Promise((resolve) => server.close(resolve)));

test('Vercel preflight permits credentials and bearer headers; unknown origins are not allowed', async () => {
  const origin = 'https://maple-construction-app-zeta.vercel.app';
  const response = await fetch(`${base}/api/auth/login`, {
    method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,authorization' },
  });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
  assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
  assert.match(response.headers.get('access-control-allow-headers'), /Authorization/);
  const denied = await fetch(`${base}/api/auth/login`, { method: 'OPTIONS', headers: { Origin: 'https://untrusted.example.com' } });
  assert.equal(denied.headers.get('access-control-allow-origin'), null);
});

test('every protected route, including the projects alias, is mounted and requires a token', async () => {
  for (const route of ['sites', 'projects', 'workers', 'attendance', 'tasks', 'issues', 'dashboard', 'materials', 'expenses', 'user/profile', 'wages/123', 'workspace', 'team', 'contractors', 'reports', 'documents', 'auth/me']) {
    const response = await fetch(`${base}/api/${route}`);
    assert.equal(response.status, 401, route);
  }
});

test('health does not claim readiness without MongoDB; missing routes return JSON 404', async () => {
  const health = await fetch(`${base}/api/health`);
  assert.equal(health.status, 503);
  assert.equal((await health.json()).database, 'disconnected');
  const missing = await fetch(`${base}/api/missing`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).message, 'API route not found');
});

test('registration hashes the password and returns a signed session accepted by login', async () => {
  const originalFind = User.findOne;
  const originalCreate = User.create;
  const originalSecret = process.env.JWT_SECRET;
  const originalRegistration = process.env.ALLOW_OWNER_REGISTRATION;
  process.env.ALLOW_OWNER_REGISTRATION = 'true';
  process.env.JWT_SECRET = 'test-only-secret';
  let savedUser;
  User.findOne = () => ({select(){return Promise.resolve(savedUser || null);},then(resolve,reject){return Promise.resolve(savedUser || null).then(resolve,reject);}});
  User.create = async (data) => (savedUser = { ...data, _id: 'test-user' });
  const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
  try {
    const registered = response();
    await register({ body: { name: 'Test', email: ' TEST@example.com ', password: 'test-password', role: 'owner' } }, registered);
    assert.equal(registered.statusCode, 201);
    assert.equal(registered.body.user.email, 'test@example.com');
    assert.equal(registered.body.user.password, undefined);
    assert.equal(jwt.verify(registered.body.token, 'test-only-secret').id, 'test-user');
    assert.equal(await bcrypt.compare('test-password', savedUser.password), true);
    const loggedIn = response();
    await login({ body: { email: 'TEST@example.com', password: 'test-password' } }, loggedIn);
    assert.equal(loggedIn.statusCode, 200);
    assert.equal(jwt.verify(loggedIn.body.token, 'test-only-secret').role, 'owner');
    const invalid = response();
    await login({ body: { email: 'test@example.com', password: 'wrong' } }, invalid);
    assert.equal(invalid.statusCode, 400);
    assert.equal(invalid.body.token, undefined);
  } finally {
    User.findOne = originalFind;
    User.create = originalCreate;
    if (originalRegistration === undefined) delete process.env.ALLOW_OWNER_REGISTRATION; else process.env.ALLOW_OWNER_REGISTRATION = originalRegistration;
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  }
});


test('client deployments disable public owner registration by default', async () => {
  const previous=process.env.ALLOW_OWNER_REGISTRATION;delete process.env.ALLOW_OWNER_REGISTRATION;
  try {const config=await fetch(`${base}/api/auth/config`);assert.equal((await config.json()).registrationEnabled,false);const response=await fetch(`${base}/api/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Owner',email:'owner@test.invalid',password:'ValidPass123!'})});assert.equal(response.status,403);}
  finally {if(previous!==undefined)process.env.ALLOW_OWNER_REGISTRATION=previous;}
});
