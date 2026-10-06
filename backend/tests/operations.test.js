const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {calculatePayroll}=require('../lib/payroll');
const app = require('../app');
const { allowed } = require('../lib/permissions');
const User = require('../models/User');
const Site = require('../models/Site');
const Worker = require('../models/Worker');
const Task = require('../models/Task');
const Issue = require('../models/Issue');
const Material = require('../models/Material');
const Expense = require('../models/Expense');
const Attendance = require('../models/Attendance');
const Report = require('../models/Report');
const Document = require('../models/Document');
const Contractor = require('../models/Contractor');
const ownerId='111111111111111111111111';const otherOrg='222222222222222222222222';const siteId='333333333333333333333333';const otherSite='444444444444444444444444';const workerId='555555555555555555555555';const taskId='666666666666666666666666';
const accounts={
  owner:{_id:ownerId,name:'Owner',email:'owner@test.invalid',role:'owner'},
  hr:{_id:'777777777777777777777777',name:'Manager',email:'hr@test.invalid',role:'hr',organizationId:ownerId,assignedSites:[siteId]},
  worker:{_id:'888888888888888888888888',name:'Worker',email:'worker@test.invalid',role:'worker',organizationId:ownerId},
};
let records;
function matches(row, filter) {
  return Object.entries(filter).every(([key,value])=>{
    if(key==='$and')return value.every((condition)=>matches(row,condition));
    if(key==='$or')return value.some((condition)=>matches(row,condition));
    if(value&&typeof value==='object'&&!Array.isArray(value)){
      if('$in' in value)return value.$in.some((entry)=>String(entry)===String(row[key]));
      if('$exists' in value)return (row[key]!==undefined)===value.$exists;
    }
    return String(row[key])===String(value);
  });
}
function query(value) {
  const resolve=()=>{const row=typeof value==='function'?value():value;return row;};
  let excluded=[];const selected=()=>{const result=resolve();const clean=(entry)=>{if(!entry)return entry;const copy={...entry};for(const key of excluded)delete copy[key];return copy;};return Array.isArray(result)?result.map(clean):clean(result);};
  return {sort(){return this;},populate(){return this;},select(fields){excluded=fields.split(' ').filter(key=>key.startsWith('-')).map(key=>key.slice(1));return this;},lean:async()=>selected(),then(onFulfilled,onRejected){return Promise.resolve(selected()).then(onFulfilled,onRejected);}};
}
function document(resource, record) {
  if(!record)return null;
  return { ...record, toObject(){const result={...this};delete result.toObject;delete result.save;return result;},async save(){const result=this.toObject();records[resource]=records[resource].map((entry)=>entry._id===this._id?result:entry);return this;} };
}
const modelMap={sites:Site,workers:Worker,contractors:Contractor,tasks:Task,issues:Issue,materials:Material,expenses:Expense,attendance:Attendance,reports:Report,documents:Document};
const originals=[];let server;let base;const originalSecret=process.env.JWT_SECRET;
test.before(async()=>{
  process.env.JWT_SECRET='operations-test-only';
  for(const [resource,model]of Object.entries(modelMap)){
    for(const method of ['find','findOne','create','findOneAndUpdate','findOneAndDelete','countDocuments'])originals.push([model,method,model[method]]);
    model.find=(filter)=>query(()=>records[resource].filter((record)=>matches(record,filter)));
    model.findOne=(filter)=>query(()=>document(resource,records[resource].find((record)=>matches(record,filter))));
    model.create=async(payload)=>{const result={...payload,_id:'999999999999999999999999'};records[resource].push(result);return document(resource,result);};
    model.findOneAndUpdate=async(filter,update,options={})=>{const existing=records[resource].find((record)=>matches(record,filter));if(existing){Object.assign(existing,update.$set);return document(resource,existing);}return options.upsert?model.create(update.$set):null;};
    model.countDocuments=async(filter)=>records[resource].filter((record)=>matches(record,filter)).length;
    model.findOneAndDelete=async(filter)=>{const record=records[resource].find((entry)=>matches(entry,filter));records[resource]=records[resource].filter((entry)=>entry!==record);return record;};
  }
  for(const method of ['findById','findOne','find','create','findOneAndUpdate','deleteOne'])originals.push([User,method,User[method]]);
  User.findById=(id)=>query(()=>document('users',records.users.find(entry=>entry._id===id)));
  User.findOne=(filter)=>query(()=>document('users',records.users.find(entry=>matches(entry,filter))));
  User.find=(filter)=>query(()=>records.users.filter(entry=>matches(entry,filter)));
  User.create=async(payload)=>{const entry={...payload,_id:String(records.users.length+1).padStart(24,'0')};records.users.push(entry);return document('users',entry);};
  User.findOneAndUpdate=(filter,update)=>query(()=>{const entry=records.users.find(row=>matches(row,filter));if(!entry)return null;Object.assign(entry,update.$set||update);for(const [key,value]of Object.entries(update.$inc||{}))entry[key]=(entry[key]||0)+value;return document('users',entry);});
  User.deleteOne=async(filter)=>{records.users=records.users.filter(entry=>!matches(entry,filter));};
  server=app.listen(0,'127.0.0.1');await new Promise((resolve)=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}`;
});
test.beforeEach(()=>{
  records={sites:[{_id:siteId,createdBy:ownerId,siteName:'Allowed site'},{_id:otherSite,organizationId:otherOrg,siteName:'Other workspace'}],workers:[{_id:workerId,organizationId:ownerId,assignedSite:siteId,userId:accounts.worker._id,fullName:'Worker',dailyWage:950,status:'Active'}],tasks:[{_id:taskId,organizationId:ownerId,site:siteId,assignedTo:workerId,title:'Assigned task',status:'Pending'},{_id:'aaaaaaaaaaaaaaaaaaaaaaaa',organizationId:otherOrg,site:otherSite,title:'Foreign task',status:'Pending'}],contractors:[],issues:[],materials:[],expenses:[{_id:'bbbbbbbbbbbbbbbbbbbbbbbb',organizationId:ownerId,site:siteId,amount:100}],attendance:[],reports:[],documents:[],users:Object.values(accounts).map(account=>({...account,tokenVersion:0,mustChangePassword:false,password:bcrypt.hashSync('CurrentPass123!',4)}))};
});
test.after(async()=>{for(const [model,method,value]of originals)model[method]=value;if(originalSecret===undefined)delete process.env.JWT_SECRET;else process.env.JWT_SECRET=originalSecret;await new Promise((resolve)=>server.close(resolve));});
const request=(role,path,method='GET',body)=>fetch(`${base}${path}`,{method,headers:{Authorization:`Bearer ${jwt.sign({id:accounts[role]._id,role:'owner'},'operations-test-only')}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});

test('server checks current account role rather than trusting the JWT role claim',async()=>{
  const result=await request('worker','/api/expenses');assert.equal(result.status,403);
  const manager=await request('hr','/api/team');assert.equal(manager.status,403);
  const denied=await request('worker','/api/sites','POST',{siteName:'Unauthorized'});assert.equal(denied.status,403);
});
test('managers see only assigned sites and workers see only their linked task records',async()=>{
  const manager=await request('hr','/api/sites');assert.deepEqual((await manager.json()).sites.map((site)=>site._id),[siteId]);
  const worker=await request('worker','/api/tasks');assert.deepEqual((await worker.json()).tasks.map((task)=>task._id),[taskId]);
});
test('worker status updates cannot reassign a task or overwrite workspace ownership',async()=>{
  const result=await request('worker',`/api/tasks/${taskId}`,'PUT',{status:'Completed',assignedTo:'bad-worker',organizationId:otherOrg,createdBy:accounts.worker._id,title:'Changed'});assert.equal(result.status,200);
  assert.equal(records.tasks[0].status,'Completed');assert.equal(records.tasks[0].assignedTo,workerId);assert.equal(records.tasks[0].organizationId,ownerId);assert.equal(records.tasks[0].title,'Assigned task');
});
test('foreign workspace IDs are denied for reads, writes and references',async()=>{
  const get=await request('owner',`/api/sites/${otherSite}`);assert.equal(get.status,404);
  const update=await request('owner','/api/tasks/aaaaaaaaaaaaaaaaaaaaaaaa','PUT',{status:'Completed'});assert.equal(update.status,404);
  const create=await request('hr','/api/issues','POST',{title:'Cross-site issue',site:otherSite,description:'Test'});assert.equal(create.status,403);
});
test('worker reports are attributed to the signed-in user and limited to safety reports',async()=>{
  const forbidden=await request('worker','/api/reports','POST',{site:siteId,title:'Daily report',type:'Daily progress'});assert.equal(forbidden.status,403);
  const safety=await request('worker','/api/reports','POST',{site:siteId,title:'Safety observation',type:'Safety inspection',date:'2026-10-07',summary:'PPE checked',createdBy:ownerId,organizationId:otherOrg});assert.equal(safety.status,201);assert.equal(records.reports[0].createdBy,accounts.worker._id);assert.equal(records.reports[0].organizationId,ownerId);
});
test('attendance corrections update one daily record and never fake a second entry',async()=>{
  const payload={site:siteId,worker:workerId,date:'2026-10-07',status:'Present'};
  assert.equal((await request('hr','/api/attendance','POST',payload)).status,201);
  assert.equal((await request('hr','/api/attendance','POST',{...payload,status:'Half Day'})).status,201);
  assert.equal(records.attendance.length,1);assert.equal(records.attendance[0].status,'Half Day');
});
test('workers with login accounts or operational history cannot be deleted',async()=>{
  const result=await request('hr',`/api/workers/${workerId}`,'DELETE');assert.equal(result.status,409);assert.equal(records.workers.length,1);
});
test('document validation rejects executable URLs and over-size uploads',async()=>{
  const document=new Document({organizationId:ownerId,site:siteId,createdBy:ownerId,title:'Test',url:'javascript:alert(1)'});
  await assert.rejects(document.validate(),/http/i);
  const invalid=new Document({organizationId:ownerId,site:siteId,createdBy:ownerId,title:'Test',attachment:'data:text/html;base64,PGgxPnRlc3Q8L2gxPg=='});
  await assert.rejects(invalid.validate());
  const tooLarge=new Document({organizationId:ownerId,site:siteId,createdBy:ownerId,title:'Test',attachment:`data:application/pdf;base64,${Buffer.alloc(2*1024*1024+1).toString('base64')}`});await assert.rejects(tooLarge.validate());
});
test('permission matrix denies financial and administrative access to non-owners',()=>{
  for(const role of ['hr','worker'])for(const action of ['read','create','update','delete'])assert.equal(allowed({role},'expenses',action),false);
  assert.equal(allowed({role:'worker'},'attendance','create'),false);assert.equal(allowed({role:'worker'},'tasks','update'),true);
});

test('workspace responses include every module without disclosing financial or credential data to workers',async()=>{
  const owner=await request('owner','/api/workspace');assert.equal(owner.status,200);const full=await owner.json();for(const key of [...Object.keys(modelMap),'team'])assert.ok(Array.isArray(full[key]),key);assert.equal(full.team.some(user=>user.password),false);
  const worker=await request('worker','/api/workspace');assert.equal(worker.status,200);const own=await worker.json();assert.equal(own.expenses.length,0);assert.equal(own.team.length,0);assert.equal(own.materials.length,0);assert.equal(own.contractors.length,0);assert.equal(own.workers.length,1);
});
test('a changed or disabled account revokes old bearer sessions',async()=>{
  const account=records.users.find(entry=>entry._id===accounts.worker._id);account.tokenVersion=1;assert.equal((await request('worker','/api/tasks')).status,401);account.tokenVersion=0;account.active=false;assert.equal((await request('worker','/api/tasks')).status,401);
});
test('temporary passwords restrict site access until a verified password change',async()=>{
  const account=records.users.find(entry=>entry._id===accounts.worker._id);account.mustChangePassword=true;assert.equal((await request('worker','/api/workspace')).status,403);
  const me=await request('worker','/api/auth/me');assert.equal(me.status,200);const profile=(await me.json()).user;assert.equal(profile.mustChangePassword,true);assert.equal(profile.password,undefined);
  assert.equal((await request('worker','/api/user/password','PUT',{currentPassword:'wrong',password:'UpdatedPass123!'})).status,400);
  assert.equal((await request('worker','/api/user/password','PUT',{currentPassword:'CurrentPass123!',password:'UpdatedPass123!'})).status,200);
  const updated=records.users.find(entry=>entry._id===accounts.worker._id);assert.equal(updated.tokenVersion,1);assert.equal(updated.mustChangePassword,false);assert.equal(await bcrypt.compare('UpdatedPass123!',updated.password),true);assert.equal((await request('worker','/api/tasks')).status,401);
});
test('only owners can reset scoped team credentials',async()=>{
  const path=`/api/team/${accounts.worker._id}/password`;assert.equal((await request('hr',path,'PUT',{password:'UpdatedPass123!'})).status,403);
  assert.equal((await request('owner',path,'PUT',{password:'UpdatedPass123!'})).status,200);const account=records.users.find(entry=>entry._id===accounts.worker._id);assert.equal(account.mustChangePassword,true);assert.equal(account.tokenVersion,1);
  assert.equal((await request('owner','/api/team/aaaaaaaaaaaaaaaaaaaaaaaa/password','PUT',{password:'UpdatedPass123!'})).status,404);
});
test('attendance rates survive wage changes and future muster dates are refused',async()=>{
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());const payload={site:siteId,worker:workerId,date:today,status:'Present'};
  assert.equal((await request('hr','/api/attendance','POST',payload)).status,201);assert.equal(records.attendance[0].dailyRate,950);records.workers[0].dailyWage=1500;
  assert.equal((await request('hr','/api/attendance','POST',{...payload,status:'Half Day'})).status,201);assert.equal(records.attendance[0].dailyRate,950);assert.equal(records.attendance.length,1);
  const future=new Date(Date.now()+2*86400000).toISOString().slice(0,10);assert.equal((await request('hr','/api/attendance','POST',{...payload,date:future})).status,400);
  assert.equal(calculatePayroll(records.workers[0],records.attendance).totalSalary,475);
});
test('financial references and paid expense history are validated',async()=>{
  const invalid={site:siteId,description:'Labour settlement',category:'Labour',amount:1000,status:'Paid',paidTo:'Site workforce'};assert.equal((await request('owner','/api/expenses','POST',invalid)).status,400);
  records.expenses[0].status='Paid';assert.equal((await request('owner','/api/expenses/bbbbbbbbbbbbbbbbbbbbbbbb','DELETE')).status,409);
  assert.equal((await request('hr','/api/attendance','POST',{site:siteId,worker:{$ne:null},date:'2026-10-07',status:'Present'})).status,400);
});

test('owner-created team accounts require assigned sites or an unlinked active worker',async()=>{
  const manager={name:'New Manager',email:'new-manager@test.invalid',password:'InitialPass123!',role:'hr',assignedSites:[siteId]};
  assert.equal((await request('owner','/api/team','POST',{...manager,assignedSites:[]})).status,400);
  const created=await request('owner','/api/team','POST',manager);assert.equal(created.status,201);const account=(await created.json()).user;assert.equal(account.mustChangePassword,true);assert.equal(account.password,undefined);assert.equal(account.tokenVersion,undefined);
  delete records.workers[0].userId;const worker=await request('owner','/api/team','POST',{name:'New Worker',email:'new-worker@test.invalid',password:'InitialPass123!',role:'worker',workerId});assert.equal(worker.status,201);assert.equal(records.workers[0].userId,(await worker.json()).user._id);
  assert.equal((await request('owner','/api/team','POST',{name:'Duplicate',email:'duplicate@test.invalid',password:'InitialPass123!',role:'worker',workerId})).status,400);
});

test('real document uploads retain scoped downloads without bloating workspace responses',async()=>{
  const attachment='data:application/pdf;base64,'+Buffer.from('%PDF-1.7\n'+'document content '.repeat(600)).toString('base64');
  const created=await request('owner','/api/documents','POST',{site:siteId,title:'Drawing',type:'Drawing',revision:'R0',attachment,fileName:'drawing.pdf'});assert.equal(created.status,201);const id=(await created.json()).document._id;
  const workspace=await request('worker','/api/workspace');const documents=(await workspace.json()).documents;assert.equal(documents.length,1);assert.equal(documents[0].hasAttachment,true);assert.equal(documents[0].attachment,undefined);
  const download=await request('worker',`/api/documents/${id}`);assert.equal(download.status,200);assert.equal((await download.json()).attachment,attachment);
});
