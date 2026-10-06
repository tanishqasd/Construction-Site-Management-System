const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { calculatePayroll } = require('../lib/payroll');
const auth = require('../middleware/authMiddleware');
const { roleOf, orgOf, orgFilter, allowed } = require('../lib/permissions');
const User = require('../models/User');
const Site = require('../models/Site');
const Worker = require('../models/Worker');
const models = {
  sites: Site, workers: Worker, contractors: require('../models/Contractor'), tasks: require('../models/Task'), issues: require('../models/Issue'),
  materials: require('../models/Material'), expenses: require('../models/Expense'),
  attendance: require('../models/Attendance'), reports: require('../models/Report'), documents: require('../models/Document'),
};
const fields = {
  sites: ['siteName','location','clientName','budget','startDate','expectedEndDate','status','progress','managerName'],
  workers: ['fullName','phone','email','skill','dailyWage','status','emergencyContact','assignedSite'],
  contractors: ['companyName','contactName','phone','email','trade','crewSize','status','site'],
  tasks: ['title','description','site','assignedTo','priority','status','dueDate'],
  issues: ['title','description','site','severity','status','category'],
  materials: ['materialName','category','quantity','unit','costPerUnit','site','reorderLevel','supplier'],
  expenses: ['site','category','description','amount','expenseDate','status','paidTo','paymentMethod'],
  attendance: ['worker','site','date','status','shift','notes'],
  reports: ['site','title','date','type','summary','weather','hoursWorked'],
  documents: ['site','title','type','url','revision','attachment','fileName'],
};
const router = express.Router();
const fail = (status, message) => { const error = new Error(message); error.status = status; throw error; };
const id = (value) => String(value?._id || value || '');
const pick = (body, keys) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) fail(400, 'Provide a JSON object.');
  return Object.fromEntries(keys.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
};
const validId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value) || value instanceof mongoose.Types.ObjectId;
const validDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) fail(400, 'Choose a valid date.');
  date.setUTCHours(0, 0, 0, 0); return date;
};
const handler = (fn) => async (req, res, next) => { try { await fn(req, res); } catch (error) { next(error); } };
router.use((req, res, next) => {
  if (req.path === '/projects' || req.path.startsWith('/projects/')) req.url = req.url.replace('/projects', '/sites');
  const root = req.path.split('/')[1];
  if (![...Object.keys(models), 'workspace', 'user', 'team', 'wages', 'dashboard'].includes(root)) return next('router');
  next();
});
router.use(auth);

async function access(req) {
  if (req.access) return req.access;
  const org = orgOf(req.user);
  const allSites = await Site.find(orgFilter(req.user)).lean();
  const role = roleOf(req.user);
  let worker = null;
  let sites = allSites;
  if (role === 'hr') sites = allSites.filter((site) => (req.user.assignedSites || []).some((assigned) => id(assigned) === id(site)));
  if (role === 'worker') {
    worker = await Worker.findOne({ $and: [orgFilter(req.user), { $or: [{ userId: req.user.id }, { userId: { $exists: false }, email: req.user.email }] }] }).lean();
    sites = allSites.filter((site) => id(site) === id(worker?.assignedSite));
  }
  req.access = { org, sites, siteIds: sites.map((site) => site._id), worker, role };
  return req.access;
}

async function filter(req, resource) {
  const scope = await access(req);
  if (resource === 'sites') return { _id: { $in: scope.siteIds } };
  const legacy = resource === 'attendance' ? 'markedBy' : resource === 'issues' ? 'reportedBy' : 'createdBy';
  const clauses = [orgFilter(req.user, legacy)];
  if (resource === 'workers') {
    if (scope.role === 'worker') clauses.push({ _id: scope.worker?._id || null });
    else if (scope.role === 'hr') clauses.push({ assignedSite: { $in: scope.siteIds } });
  } else {
    if (!(scope.role === 'worker' && resource === 'attendance')) clauses.push({ site: { $in: scope.siteIds } });
    if (scope.role === 'worker') {
      if (resource === 'tasks') clauses.push({ assignedTo: scope.worker?._id || null });
      if (resource === 'attendance') clauses.push({ worker: scope.worker?._id || null });
      if (resource === 'issues') clauses.push({ reportedBy: req.user.id });
      if (resource === 'reports') clauses.push({ createdBy: req.user.id });
    }
  }
  return { $and: clauses };
}

function populated(resource, query) {
  if (resource === 'sites') return query;
  if (resource === 'workers') return query.populate('assignedSite', 'siteName location');
  query.populate('site', 'siteName location');
  if (resource === 'tasks') query.populate('assignedTo', 'fullName skill');
  if (resource === 'attendance') query.populate('worker', 'fullName skill dailyWage');
  return query;
}
async function list(req, resource) {
  if (!allowed(req.user, resource, 'read')) return [];
  const query = populated(resource, models[resource].find(await filter(req, resource)).sort({ createdAt: -1 }));
  if (resource === 'documents') query.select('-attachment');
  const records = await query.lean();
  return resource === 'documents' ? records.map((record) => ({ ...record, hasAttachment: !!record.fileName })) : records;
}
function authorize(req, resource, action) {
  if (!allowed(req.user, resource, action)) fail(403, 'Your role does not have access to this action.');
}
async function validateReferences(req, resource, data) {
  const numbers = { sites:['budget','progress'], workers:['dailyWage'], contractors:['crewSize'], materials:['quantity','costPerUnit','reorderLevel'], expenses:['amount'], reports:['hoursWorked'] }[resource] || [];
  for (const key of numbers) if (data[key] !== undefined && (typeof data[key] !== 'number' || !Number.isFinite(data[key]) || data[key] < 0)) fail(400, `Provide a valid non-negative ${key}.`);
  for (const [key, value] of Object.entries(data)) if (key !== 'attachment' && typeof value === 'string' && value.length > 5000) fail(400, 'Text fields must be 5,000 characters or shorter.');
  if (resource === 'contractors' && data.crewSize !== undefined && !Number.isInteger(data.crewSize)) fail(400, 'Crew size must be a whole number.');
  const scope = await access(req);
  const siteId = resource === 'workers' ? data.assignedSite : data.site;
  if (siteId && !validId(siteId)) fail(400, 'Choose a valid site.');
  if (siteId && !scope.siteIds.some((site) => id(site) === id(siteId))) fail(403, 'Choose a site assigned to your workspace and role.');
  if (resource === 'workers' && scope.role === 'hr' && !data.assignedSite) fail(400, 'Assign this worker to one of your sites.');
  const workerId = resource === 'tasks' ? data.assignedTo : resource === 'attendance' ? data.worker : null;
  if (workerId) {
    if (!validId(workerId)) fail(400, 'Choose a valid worker.');
    const worker = await Worker.findOne({ $and: [orgFilter(req.user), { _id: workerId }] }).lean();
    if (!worker || id(worker.assignedSite) !== id(data.site)) fail(400, 'The selected worker must belong to this site.');
    if (resource === 'attendance') req.attendanceWorker = worker;
  }
  if (resource === 'sites' && new Date(data.expectedEndDate) < new Date(data.startDate)) fail(400, 'Completion date must follow the start date.');
  if (resource === 'reports' && scope.role === 'worker' && data.type !== 'Safety inspection') fail(403, 'Workers can submit safety reports.');
  if (resource === 'attendance') {
    const date = validDate(data.date);
    const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());
    if (date.toISOString().slice(0,10) > today) fail(400, 'Attendance can only be recorded for today or a previous date.');
  }
  if (resource === 'documents' && data.attachment && !data.fileName) fail(400, 'Provide a filename for the attachment.');
  if (resource === 'expenses' && data.status === 'Paid' && (typeof data.paidTo !== 'string' || !data.paidTo.trim() || !['Bank transfer','UPI','Cash','Cheque'].includes(data.paymentMethod))) fail(400, 'Record the payee and payment method before marking an expense Paid.');
}

router.get('/workspace', handler(async (req, res) => {
  const resources = Object.keys(models);
  const values = await Promise.all(resources.map((resource) => list(req, resource)));
  const team = roleOf(req.user) === 'owner' ? await User.find({ $or: [{ organizationId: orgOf(req.user) }, { _id: orgOf(req.user) }] }).select('-password').lean() : [];
  res.json({ ...Object.fromEntries(resources.map((resource, index) => [resource, values[index]])), team });
}));
router.get('/user/profile', handler(async (req, res) => res.json(req.user)));
router.put('/user/profile', handler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, pick(req.body || {}, ['name']), { new: true, runValidators: true }).select('-password');
  res.json({ user });
}));
router.put('/user/password', handler(async (req, res) => {
  const { currentPassword, password } = req.body || {};
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) fail(400, 'Use a password of 8–72 bytes.');
  const user = await User.findById(req.user.id).select('+tokenVersion');
  if (typeof currentPassword !== 'string' || !(await bcrypt.compare(currentPassword, user.password))) fail(400, 'Current password is incorrect.');
  user.password = await bcrypt.hash(password, 12); user.tokenVersion = (user.tokenVersion || 0) + 1; user.mustChangePassword = false; await user.save();
  res.json({ message: 'Password updated.' });
}));
router.get('/team', handler(async (req, res) => {
  authorize(req, 'team', 'read');
  res.json({ team: await User.find({ $or: [{ organizationId: orgOf(req.user) }, { _id: orgOf(req.user) }] }).select('-password').lean() });
}));
router.post('/team', handler(async (req, res) => {
  authorize(req, 'team', 'create');
  const { name, email, password, role, assignedSites = [], workerId } = req.body || {};
  if (!['hr', 'worker'].includes(role) || typeof name !== 'string' || !name.trim() || name.length > 120 || typeof email !== 'string' || !isEmail(email.trim()) || typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72 || !Array.isArray(assignedSites)) fail(400, 'Provide a valid name, email, role and password of 8–72 bytes.');
  const scope = await access(req);
  if (assignedSites.some((site) => !scope.siteIds.some((allowedSite) => id(site) === id(allowedSite)))) fail(403, 'One of the selected sites is outside your workspace.');
  if (role === 'hr' && !assignedSites.length) fail(400, 'Assign at least one site to the manager.');
  let worker;
  if (role === 'worker') {
    if (!validId(workerId)) fail(400, 'Choose a valid worker profile.');
    worker = await Worker.findOne({ $and: [orgFilter(req.user), { _id: workerId }] });
    if (!worker || worker.userId || worker.status === 'Inactive') fail(400, 'Choose an active worker without a linked login account.');
  }
  const user = await User.create({ name, email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 12), role, assignedSites, organizationId: orgOf(req.user), mustChangePassword: true });
  if (worker) {
    try {
      const linked = await Worker.findOneAndUpdate({ $and: [orgFilter(req.user), { _id: worker._id }, { $or: [{ userId: { $exists: false } }, { userId: null }] }] }, { $set: { userId: user._id } }, { new: true, runValidators: true });
      if (!linked) fail(409, 'This worker was already linked to another account. Refresh and try again.');
    }
    catch (error) { await User.deleteOne({ _id: user._id }); throw error; }
  }
  const result = user.toObject(); delete result.password; delete result.tokenVersion;
  res.status(201).json({ user: result });
}));
router.put('/team/:id', handler(async (req, res) => {
  authorize(req, 'team', 'update');
  if (!validId(req.params.id)) fail(400, 'Choose a valid account.');
  if (req.params.id === id(orgOf(req.user))) fail(400, 'The workspace owner cannot be disabled here.');
  const data = pick(req.body || {}, ['name', 'email', 'active', 'assignedSites']);
  if (data.email !== undefined && (typeof data.email !== 'string' || !isEmail(data.email.trim()))) fail(400, 'Enter a valid email address.');
  if (data.active !== undefined && typeof data.active !== 'boolean') fail(400, 'Choose a valid account status.');
  const scope = await access(req);
  if (data.assignedSites && (!Array.isArray(data.assignedSites) || data.assignedSites.some((site) => !scope.siteIds.some((allowedSite) => id(site) === id(allowedSite))))) fail(403, 'Invalid site assignment.');
  const current = await User.findOne({ _id: req.params.id, organizationId: orgOf(req.user) });
  if (!current) fail(404, 'Team member not found.');
  if (roleOf(current) === 'hr' && data.assignedSites && !data.assignedSites.length && data.active !== false) fail(400, 'Assign at least one site to an active manager.');
  const update = { $set: data };
  if (data.active === false || data.email && data.email !== current.email) update.$inc = { tokenVersion: 1 };
  const user = await User.findOneAndUpdate({ _id: req.params.id, organizationId: orgOf(req.user) }, update, { new: true, runValidators: true }).select('-password');
  if (!user) fail(404, 'Team member not found.');
  res.json({ user });
}));
router.put('/team/:id/password', handler(async (req, res) => {
  authorize(req, 'team', 'update');
  if (!validId(req.params.id) || req.params.id === id(orgOf(req.user))) fail(400, 'Choose a team account. Change your own password in My account.');
  const { password } = req.body || {};
  if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password,'utf8') > 72) fail(400, 'Use a temporary password of 8–72 bytes.');
  const member = await User.findOneAndUpdate({ _id: req.params.id, organizationId: orgOf(req.user) }, { $set: { password: await bcrypt.hash(password,12), mustChangePassword:true }, $inc:{tokenVersion:1} }, { new:true,runValidators:true }).select('-password');
  if (!member) fail(404, 'Team member not found.');
  res.json({ message:'Temporary password set. Existing sessions have been signed out.' });
}));

for (const resource of Object.keys(models)) {
  const Model = models[resource];
  const singular = { sites: 'site', workers: 'worker', contractors: 'contractor', tasks: 'task', issues: 'issue', materials: 'material', expenses: 'expense', attendance: 'attendance', reports: 'report', documents: 'document' }[resource];
  router.get(`/${resource}`, handler(async (req, res) => {
    authorize(req, resource, 'read'); const records = await list(req, resource);
    res.json({ count: records.length, [resource]: records });
  }));
  router.get(`/${resource}/:id`, handler(async (req, res) => {
    authorize(req, resource, 'read');
    if (!validId(req.params.id)) fail(400, 'Choose a valid record.');
    const record = await populated(resource, Model.findOne({ $and: [await filter(req, resource), { _id: req.params.id }] })).lean();
    if (!record) fail(404, 'Record not found.'); res.json(record);
  }));
  router.post(`/${resource}`, handler(async (req, res) => {
    authorize(req, resource, 'create');
    const data = pick(req.body || {}, fields[resource]);
    if (roleOf(req.user) === 'worker' && resource === 'issues') data.status = 'Open';
    await validateReferences(req, resource, data);
    const actor = resource === 'issues' ? 'reportedBy' : resource === 'attendance' ? 'markedBy' : 'createdBy';
    data[actor] = req.user.id; data.organizationId = orgOf(req.user);
    let record;
    if (resource === 'attendance') {
      const date = validDate(data.date); data.date = date;
      const existing = await Model.findOne({ $and: [await filter(req, resource), { worker: data.worker, date }] });
      const dailyKey = existing ? { _id: existing._id } : { worker: data.worker, date, organizationId: orgOf(req.user) };
      data.dailyRate = existing?.dailyRate ?? req.attendanceWorker.dailyWage;
      record = await Model.findOneAndUpdate(dailyKey, { $set: data }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
    } else record = await Model.create(data);
    res.status(201).json({ message: 'Saved successfully.', [singular]: record });
  }));
  router.put(`/${resource}/:id`, handler(async (req, res) => {
    authorize(req, resource, 'update');
    if (!validId(req.params.id)) fail(400, 'Choose a valid record.');
    const scopeFilter = { $and: [await filter(req, resource), { _id: req.params.id }] };
    const record = await Model.findOne(scopeFilter);
    if (!record) fail(404, 'Record not found.');
    const keys = roleOf(req.user) === 'worker' ? ['status'] : roleOf(req.user) === 'hr' && resource === 'sites' ? ['progress','status'] : fields[resource];
    const data = pick(req.body || {}, keys);
    await validateReferences(req, resource, { ...record.toObject(), ...data });
    if (resource === 'attendance') {
      if (data.date !== undefined) data.date = validDate(data.date);
      if (data.worker && id(data.worker) !== id(record.worker)) data.dailyRate = req.attendanceWorker.dailyWage;
    }
    Object.assign(record, data); await record.save();
    res.json({ message: 'Updated successfully.', [singular]: record });
  }));
  router.delete(`/${resource}/:id`, handler(async (req, res) => {
    authorize(req, resource, 'delete');
    if (!validId(req.params.id)) fail(400, 'Choose a valid record.');
    const scopeFilter = { $and: [await filter(req, resource), { _id: req.params.id }] };
    if (resource === 'expenses') {
      const expense = await Model.findOne(scopeFilter);
      if (expense?.status === 'Paid') fail(409, 'Paid expenses must be retained as payment records.');
    }
    if (resource === 'workers') {
      const worker = await Model.findOne(scopeFilter); if (!worker) fail(404, 'Record not found.');
      const dependencies = await Promise.all([models.tasks.countDocuments({ assignedTo: worker._id }), models.attendance.countDocuments({ worker: worker._id })]);
      if (worker.userId || dependencies.some(Boolean)) fail(409, 'This worker has a login or operational history. Mark the profile Inactive instead.');
    }
    if (resource === 'sites') {
      const record = await Model.findOne(scopeFilter); if (!record) fail(404, 'Record not found.');
      const dependencies = await Promise.all(Object.entries(models).filter(([name]) => name !== 'sites').map(([name, model]) => model.countDocuments({ [name === 'workers' ? 'assignedSite' : 'site']: record._id })));
      if (dependencies.some(Boolean)) fail(409, 'This site has related records. Archive it as Completed instead.');
    }
    const result = await Model.findOneAndDelete(scopeFilter);
    if (!result) fail(404, 'Record not found.'); res.json({ message: 'Deleted successfully.' });
  }));
}
router.get('/projects', handler(async (req, res) => res.json({ sites: await list(req, 'sites') })));
router.get('/wages/:workerId', handler(async (req, res) => {
  authorize(req, 'wages', 'read');
  if (!validId(req.params.workerId)) fail(400, 'Choose a valid worker.');
  const worker = await Worker.findOne({ $and: [await filter(req, 'workers'), { _id: req.params.workerId }] }).lean();
  if (!worker) fail(404, 'Worker not found.');
  const month = Number(req.query.month); const year = Number(req.query.year);
  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year) || year < 2000 || year > 2200) fail(400, 'Choose a valid month and year.');
  const attendance = await models.attendance.find({ $and: [await filter(req, 'attendance'), { worker: worker._id, date: { $gte: new Date(Date.UTC(year, month - 1)), $lt: new Date(Date.UTC(year, month)) } }] }).lean();
  res.json({ worker: worker.fullName, dailyWage: worker.dailyWage, ...calculatePayroll(worker, attendance) });
}));
router.get('/dashboard', handler(async (req, res) => {
  const sites = await list(req, 'sites'); const workers = await list(req, 'workers');
  res.json({ totalSites: sites.length, ongoingSites: sites.filter((site) => site.status === 'Ongoing').length, completedSites: sites.filter((site) => site.status === 'Completed').length, totalWorkers: workers.length, activeWorkers: workers.filter((worker) => worker.status === 'Active').length });
}));

router.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || (error.code === 11000 ? 409 : ['ValidationError','CastError'].includes(error.name) ? 400 : 500);
  const message = error.code === 11000 ? 'A record with these unique details already exists. Refresh and try again.' : status === 500 ? 'Could not save or load data. Please try again.' : error.message;
  res.status(status).json({ message });
});
module.exports = router;
