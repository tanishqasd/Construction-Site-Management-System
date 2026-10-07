const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Run the actual TypeScript helpers without adding a second build or test runtime.
function load(relativePath, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src', relativePath), 'utf8')
    .replaceAll('import.meta.env', 'testEnv');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, atob, btoa, Headers, Response, URL, AbortController, setTimeout, clearTimeout,
    testEnv: { VITE_API_URL: 'https://backend.example.com', PROD: true },
    require: (specifier) => load(path.posix.normalize(path.posix.join(path.posix.dirname(relativePath), `${specifier}.ts`)), globals),
    ...globals,
  });
  return exports;
}

function storage(values = {}) {
  const entries = new Map(Object.entries(values));
  return { getItem: (key) => entries.get(key) ?? null, removeItem: (key) => entries.delete(key) };
}
const user = { _id: '123', name: 'Test User', email: 'test@example.com', role: 'hr' };
const token = (exp) => `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;

test('API base accepts the Render origin or /api URL without duplicating /api', () => {
  const { resolveApiUrl } = load('services/apiUrl.ts');
  for (const url of ['https://backend.example.com', 'https://backend.example.com/api/', ' https://backend.example.com/ ']) {
    assert.equal(resolveApiUrl(url, true), 'https://backend.example.com/api');
  }
  assert.equal(resolveApiUrl(undefined, false), 'http://localhost:5000/api');
});

test('production cannot silently build against missing, localhost or HTTP API URLs', () => {
  const { resolveApiUrl } = load('services/apiUrl.ts');
  for (const url of [undefined, '', 'http://backend.example.com', 'https://localhost:5000', 'https://127.0.0.1', 'https://user:pass@backend.example.com']) {
    assert.throws(() => resolveApiUrl(url, true));
  }
});

test('refresh restores a complete unexpired session synchronously', () => {
  const savedToken = token(Math.floor(Date.now() / 1000) + 3600);
  const { readAuthSession } = load('context/authSession.ts', { localStorage: storage({ token: savedToken, user: JSON.stringify(user) }) });
  const restored = readAuthSession();
  assert.equal(restored.token, savedToken);
  assert.equal(restored.user.role, 'hr');
});

test('corrupt, partial, expired and simulated sessions are cleared without crashing', () => {
  for (const values of [
    { token: token(1), user: JSON.stringify(user) },
    { token: 'mock-session-jwt-owner', user: JSON.stringify(user) },
    { token: token(Date.now()), user: 'undefined' },
    { token: token(Date.now()) },
    { user: JSON.stringify(user) },
    { token: token(Date.now()), user: JSON.stringify({ ...user, role: 42 }) },
  ]) {
    const localStorage = storage(values);
    const { readAuthSession } = load('context/authSession.ts', { localStorage });
    assert.equal(readAuthSession().user, null);
    assert.equal(localStorage.getItem('token'), null);
  }
});

test('API sends bearer authentication and preserves caller Headers', async () => {
  const { apiRequest } = load('services/api.ts', {
    localStorage: storage({ token: 'stored-token' }),
    fetch: async (url, options) => {
      assert.equal(url, 'https://backend.example.com/api/sites');
      assert.equal(options.headers.get('Authorization'), 'Bearer stored-token');
      assert.equal(options.headers.get('X-Test'), 'yes');
      return new Response('{"sites":[]}');
    },
  });
  assert.equal((await apiRequest('/sites', { headers: new Headers({ 'X-Test': 'yes' }) })).sites.length, 0);
});

test('protected 401 clears the session; failed login does not erase another session', async () => {
  for (const endpoint of ['/sites', '/auth/login']) {
    const localStorage = storage({ token: 'stored-token', user: '{}' });
    const window = { location: { pathname: '/sites', href: '' } };
    const { apiRequest } = load('services/api.ts', {
      localStorage, window,
      fetch: async () => new Response('{"message":"Unauthorized"}', { status: 401 }),
    });
    await assert.rejects(apiRequest(endpoint), /Unauthorized/);
    assert.equal(localStorage.getItem('token'), endpoint === '/sites' ? null : 'stored-token');
    assert.equal(window.location.href, endpoint === '/sites' ? '/login' : '');
  }
});

test('network and non-JSON gateway failures produce readable errors', async () => {
  for (const fetch of [async () => { throw new TypeError('Failed to fetch'); }, async () => new Response('<html>Bad Gateway</html>', { status: 502 })]) {
    const { apiRequest } = load('services/api.ts', { localStorage: storage(), fetch });
    await assert.rejects(apiRequest('/sites'), /Unable to reach|HTTP 502/);
  }
});

test('session verification sends the bearer token while public auth config requires none',async()=>{
  const {apiRequest}=load('services/api.ts',{localStorage:storage({token:'stored-token'}),fetch:async(url,options)=>{assert.equal(options.headers.get('Authorization'),url.endsWith('/auth/me')?'Bearer stored-token':null);return new Response('{"user":{}}');}});await apiRequest('/auth/me');await apiRequest('/auth/config');
});
