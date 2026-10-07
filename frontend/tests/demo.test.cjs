const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const crypto = require('node:crypto');

function harness(enabled = true) {
  const values = new Map(); const cache = new Map(); let networkCalls = 0;
  const localStorage = {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  function load(file) {
    if(cache.has(file))return cache.get(file);
    const exports = {}; cache.set(file,exports);
    const source=fs.readFileSync(path.join(__dirname,'../src',file),'utf8').replaceAll('import.meta.env','testEnv');
    const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
    vm.runInNewContext(code,{exports,crypto,localStorage,atob,btoa,URL,Headers,Response,AbortController,setTimeout,clearTimeout,
      testEnv:{VITE_ENABLE_DEMO:String(enabled),VITE_API_URL:'https://backend.example.com',PROD:true},
      fetch:async()=>{networkCalls++;throw new Error('Unexpected backend request');},
      require:specifier=>load(path.posix.normalize(path.posix.join(path.posix.dirname(file),`${specifier}.ts`)))});
    return exports;
  }
  return {load,values,localStorage,networkCalls:()=>networkCalls};
}
test('demo entry clears live credentials and restores its own role without a JWT',async()=>{
  const h=harness();h.localStorage.setItem('token','private-real-token');h.localStorage.setItem('user','real-user');
  const session=h.load('demo/session.ts');session.beginDemo('hr');
  assert.equal(h.localStorage.getItem('token'),null);assert.equal(session.readDemoUser().role,'hr');
  assert.equal(session.demoRoleForEmail('admin@example.com'),'owner');
  const live=h.load('context/authSession.ts');assert.equal(live.readAuthSession().token,null);
  session.endDemo();assert.equal(session.readDemoUser(),null);
});
test('disabled demo flags reject personas and ignore saved demo sessions',()=>{
  const h=harness(false);h.localStorage.setItem('maple-demo-session-v3',JSON.stringify({version:1,role:'owner'}));
  const session=h.load('demo/session.ts');assert.equal(session.readDemoUser(),null);assert.throws(()=>session.beginDemo('owner'),/disabled/);
});
test('owner, manager and worker see only the modules and assignments for their role',async()=>{
  const h=harness();const session=h.load('demo/session.ts');const {demoRequest}=h.load('demo/api.ts');
  session.beginDemo('owner');const owner=await demoRequest('/workspace');assert.equal(owner.sites.length,3);assert.ok(owner.expenses.length&&owner.team.length);
  session.beginDemo('hr');const hr=await demoRequest('/workspace');assert.equal(hr.sites.length,2);assert.equal(hr.expenses.length,0);assert.equal(hr.team.length,0);await assert.rejects(demoRequest('/expenses'),/permission/);
  session.beginDemo('worker');const worker=await demoRequest('/workspace');assert.equal(worker.sites.length,1);assert.equal(worker.workers.length,1);assert.ok(worker.tasks.every(row=>row.assignedTo==='worker-1'));assert.equal(worker.materials.length,0);assert.equal(worker.contractors.length,0);
  await assert.rejects(demoRequest('/tasks/task-5'),/outside/);
});
test('demo API interception cannot send reads, edits, profile or downloads to the backend',async()=>{
  const h=harness();h.load('demo/session.ts').beginDemo('owner');const {apiRequest}=h.load('services/api.ts');
  await apiRequest('/workspace');await apiRequest('/tasks/task-1',{method:'PUT',body:JSON.stringify({status:'Completed'})});
  const profile=await apiRequest('/user/profile',{method:'PUT',body:JSON.stringify({name:'Sample director'})});assert.equal(profile.user.name,'Sample director');
  const doc=await apiRequest('/documents/document-1');assert.ok(doc.attachment.startsWith('data:application/pdf;base64,'));assert.equal(h.networkCalls(),0);
  assert.ok(atob(doc.attachment.split(',')[1]).startsWith('%PDF-1.4'));
});
test('worker status edits preserve assignment and safety reports keep the actor attribution',async()=>{
  const h=harness();h.load('demo/session.ts').beginDemo('worker');const {demoRequest}=h.load('demo/api.ts');
  await demoRequest('/tasks/task-1',{method:'PUT',body:JSON.stringify({status:'Completed',assignedTo:'worker-4',site:'site-2'})});
  const task=await demoRequest('/tasks/task-1');assert.equal(task.assignedTo,'worker-1');assert.equal(task.site,'site-1');
  await demoRequest('/reports',{method:'POST',body:JSON.stringify({title:'Sample inspection',site:'site-1',date:'2026-10-07',type:'Daily progress',summary:'PPE inspected',createdBy:'demo-owner'})});
  const data=await demoRequest('/workspace');const report=data.reports.find(row=>row.title==='Sample inspection');assert.equal(report.createdBy,'demo-worker');assert.equal(report.type,'Safety inspection');
  await assert.rejects(demoRequest('/issues',{method:'POST',body:JSON.stringify({title:'Foreign site',site:'site-2'})}),/assignments/);
});
test('muster corrections upsert one shift and preserve wage history; reset restores sample records',async()=>{
  const h=harness();h.load('demo/session.ts').beginDemo('hr');const {demoRequest,resetDemoData}=h.load('demo/api.ts');
  const before=await demoRequest('/workspace');const shift=before.attendance.find(row=>row.worker==='worker-1');
  await demoRequest('/workers/worker-1',{method:'PUT',body:JSON.stringify({dailyWage:1500})});
  await demoRequest('/attendance',{method:'POST',body:JSON.stringify({worker:'worker-1',site:'site-1',date:shift.date,status:'Half Day'})});
  const after=await demoRequest('/workspace');assert.equal(after.attendance.length,before.attendance.length);assert.equal(after.attendance.find(row=>row._id===shift._id).dailyRate,950);
  resetDemoData();assert.equal((await demoRequest('/workspace')).workers.find(row=>row._id==='worker-1').dailyWage,950);
});
test('demo documents and financial history have scoped downloads and deletion guards',async()=>{
  const h=harness();h.load('demo/session.ts').beginDemo('owner');const {demoRequest}=h.load('demo/api.ts');
  const workspace=await demoRequest('/workspace');assert.equal(workspace.documents[0].attachment,undefined);assert.equal(workspace.documents[0].hasAttachment,true);
  await assert.rejects(demoRequest('/expenses/expense-1',{method:'DELETE'}),/history/);
  await assert.rejects(demoRequest('/workers/worker-1',{method:'DELETE'}),/history/);
  h.load('demo/session.ts').beginDemo('worker');await assert.rejects(demoRequest('/documents/document-3'),/outside/);
  await assert.rejects(demoRequest('/user/password',{method:'PUT',body:'{}'}),/Client sign-in/);
});
