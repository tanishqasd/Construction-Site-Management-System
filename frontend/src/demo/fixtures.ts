import type { WorkspaceData } from '../types/workspace';
import { dateInput } from '../types/workspace';

function samplePdf(title: string, lines: string[]): string {
  const escape = (text: string) => text.replace(/[()\\]/g, '\\$&');
  const stream = `BT /F1 18 Tf 50 780 Td (${escape(title)}) Tj /F1 11 Tf ${lines.map((line) => `0 -28 Td (${escape(line)}) Tj`).join(' ')} ET`;
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return `data:application/pdf;base64,${btoa(pdf)}`;
}

export function demoWorkspace(): WorkspaceData {
  const today = dateInput();
  const day = (offset: number) => dateInput(new Date(Date.now() + offset * 86400000));
  return {
    sites: [
      { _id:'site-1', siteName:'Maple Heights', location:'Baner, Pune', clientName:'Maple Developers', budget:45000000, progress:68, status:'Ongoing', startDate:day(-180), expectedEndDate:day(75), managerName:'Ananya Sharma' },
      { _id:'site-2', siteName:'Riverside Business Park', location:'Thane, Mumbai', clientName:'Riverside Commercial', budget:72000000, progress:42, status:'Ongoing', startDate:day(-110), expectedEndDate:day(160), managerName:'Ananya Sharma' },
      { _id:'site-3', siteName:'Greenfield Residences', location:'Wakad, Pune', clientName:'Greenfield Realty', budget:28000000, progress:12, status:'Planning', startDate:day(-15), expectedEndDate:day(240), managerName:'Vikram Patel' },
    ],
    workers: [
      { _id:'worker-1', fullName:'Field Worker / Crew', phone:'0000000001', email:'worker@construction.com', skill:'Mason', dailyWage:950, status:'Active', assignedSite:'site-1', userId:'demo-worker' },
      { _id:'worker-2', fullName:'Suresh Patil', phone:'9000000002', skill:'Carpenter', dailyWage:1100, status:'Active', assignedSite:'site-1' },
      { _id:'worker-3', fullName:'Meena Singh', phone:'9000000003', skill:'Electrician', dailyWage:1250, status:'Active', assignedSite:'site-1' },
      { _id:'worker-4', fullName:'Rahul Verma', phone:'9000000004', skill:'Plumber', dailyWage:1050, status:'Active', assignedSite:'site-2' },
      { _id:'worker-5', fullName:'Amit Desai', phone:'9000000005', skill:'Labour', dailyWage:700, status:'Active', assignedSite:'site-2' },
      { _id:'worker-6', fullName:'Priya Nair', phone:'9000000006', skill:'Supervisor', dailyWage:1500, status:'Active', assignedSite:'site-2' },
      { _id:'worker-7', fullName:'Vijay Rao', phone:'9000000007', skill:'Painter', dailyWage:900, status:'Active', assignedSite:'site-3' },
      { _id:'worker-8', fullName:'Kiran Shah', phone:'9000000008', skill:'Labour', dailyWage:700, status:'Inactive', assignedSite:'site-3' },
    ],
    contractors: [
      { _id:'contractor-1', companyName:'Patil Civil Works', contactName:'Sanjay Patil', phone:'9000000011', trade:'Masonry & concrete', crewSize:12, status:'Active', site:'site-1' },
      { _id:'contractor-2', companyName:'Precision MEP', contactName:'Neha Kulkarni', phone:'9000000012', trade:'Electrical & plumbing', crewSize:8, status:'Active', site:'site-2' },
    ],
    tasks: [
      { _id:'task-1', title:'Complete Block B masonry', description:'Finish the east wall and check alignment before the inspection.', site:'site-1', assignedTo:'worker-1', priority:'High', status:'In Progress', dueDate:day(2) },
      { _id:'task-2', title:'Inspect scaffold anchors', description:'Check anchor bolts and report missing edge protection.', site:'site-1', assignedTo:'worker-1', priority:'Critical', status:'Pending', dueDate:today },
      { _id:'task-3', title:'Install floor 4 shuttering', site:'site-1', assignedTo:'worker-2', priority:'High', status:'In Progress', dueDate:day(3) },
      { _id:'task-4', title:'Electrical conduit inspection', site:'site-1', assignedTo:'worker-3', priority:'Medium', status:'Completed', dueDate:day(-1) },
      { _id:'task-5', title:'Pressure test plumbing risers', site:'site-2', assignedTo:'worker-4', priority:'High', status:'Blocked', dueDate:day(-2) },
      { _id:'task-6', title:'Clear site access road', site:'site-2', assignedTo:'worker-5', priority:'Medium', status:'Pending', dueDate:day(4) },
      { _id:'task-7', title:'Foundation quality checklist', site:'site-3', priority:'Medium', status:'Pending', dueDate:day(6) },
    ],
    materials: [
      { _id:'material-1', materialName:'OPC 53 cement', category:'Cement', quantity:180, unit:'Bag', costPerUnit:390, site:'site-1', reorderLevel:200, supplier:'Pune Cement Supply' },
      { _id:'material-2', materialName:'TMT steel 16 mm', category:'Steel', quantity:8.5, unit:'Ton', costPerUnit:62500, site:'site-1', reorderLevel:5, supplier:'Metro Steel' },
      { _id:'material-3', materialName:'AAC blocks', category:'Bricks', quantity:3200, unit:'Piece', costPerUnit:68, site:'site-2', reorderLevel:1000, supplier:'Buildwell Materials' },
      { _id:'material-4', materialName:'Coarse aggregate', category:'Gravel', quantity:12, unit:'Cubic Meter', costPerUnit:2800, site:'site-2', reorderLevel:15, supplier:'Riverstone Aggregates' },
      { _id:'material-5', materialName:'Exterior primer', category:'Paint', quantity:90, unit:'Litre', costPerUnit:210, site:'site-3', reorderLevel:30, supplier:'Colourcraft' },
    ],
    expenses: [
      { _id:'expense-1', description:'Reinforcement steel delivery', category:'Material', amount:1850000, expenseDate:day(-5), site:'site-1', status:'Paid', paidTo:'Metro Steel', paymentMethod:'Bank transfer' },
      { _id:'expense-2', description:'Tower crane monthly rental', category:'Equipment', amount:420000, expenseDate:day(-3), site:'site-2', status:'Approved', paidTo:'Apex Equipment' },
      { _id:'expense-3', description:'Weekly labour settlement', category:'Labour', amount:185500, expenseDate:day(-1), site:'site-1', status:'Pending', paidTo:'Site workforce' },
      { _id:'expense-4', description:'Site access transport', category:'Transport', amount:64000, expenseDate:today, site:'site-3', status:'Pending', paidTo:'City Logistics' },
      { _id:'expense-5', description:'Concrete pump maintenance', category:'Maintenance', amount:95000, expenseDate:day(-8), site:'site-2', status:'Paid', paidTo:'Apex Equipment', paymentMethod:'Bank transfer' },
    ],
    attendance: [-6,-5,-4,-3,-2,-1,0].flatMap((offset) => Array.from({length:7},(_,i) => ({ _id:`attendance-${offset}-${i}`, worker:`worker-${i+1}`, site:i<3?'site-1':i<6?'site-2':'site-3', date:day(offset), status:offset===0&&i===4?'Absent':offset===-1&&i===0?'Half Day':'Present', shift:'General', notes:'Sample shift', dailyRate:[950,1100,1250,1050,700,1500,900][i], organizationId:'demo-owner' }))),
    issues: [
      { _id:'issue-1', title:'Missing edge protection on level 4', description:'East scaffold platform needs toe boards before work resumes.', severity:'Critical', category:'Safety', status:'Open', site:'site-1', reportedBy:'demo-worker', createdAt:day(-1) },
      { _id:'issue-2', title:'Water leak in riser B', description:'Pressure drop detected during the pre-inspection test.', severity:'High', category:'Quality', status:'In Review', site:'site-2', reportedBy:'demo-hr', createdAt:day(-2) },
      { _id:'issue-3', title:'Concrete finish requires repair', description:'Minor surface defect at column C12.', severity:'Medium', category:'Quality', status:'Resolved', site:'site-1', reportedBy:'demo-hr', createdAt:day(-4) },
    ],
    reports: [
      { _id:'report-1', title:'Block B daily progress', date:today, type:'Daily progress', summary:'Masonry progressed to level 4. Electrical inspection completed. Scaffold inspection pending.', site:'site-1', weather:'Clear, 29°C', hoursWorked:8, createdBy:'demo-hr' },
      { _id:'report-2', title:'Morning safety inspection', date:today, type:'Safety inspection', summary:'PPE checked. Missing edge protection reported; work paused in the affected area.', site:'site-1', weather:'Clear', hoursWorked:0, createdBy:'demo-worker' },
    ],
    documents: [
      { _id:'document-1', title:'Site safety induction', type:'Certificate', revision:'R1', site:'site-1', fileName:'sample-safety-induction.pdf', hasAttachment:true, attachment:samplePdf('Safety induction - sample', ['Wear a helmet, safety shoes and high visibility clothing.', 'Check scaffold access before starting work.', 'Report hazards through Issues & safety.', 'This is a sample document for demonstration.']) },
      { _id:'document-2', title:'Block B work package', type:'Drawing', revision:'R2', site:'site-1', fileName:'sample-work-package.pdf', hasAttachment:true, attachment:samplePdf('Block B work package - sample', ['Masonry work package, level 4 east wall.', 'Check alignment and scaffold anchors.', 'Submit the daily progress report after inspection.']) },
      { _id:'document-3', title:'Riverside daily checklist', type:'Report', revision:'R1', site:'site-2', fileName:'sample-checklist.pdf', hasAttachment:true, attachment:samplePdf('Daily checklist - sample', ['Inspect equipment and material deliveries.', 'Review assigned tasks and muster roll.', 'Close resolved issues with the site manager.']) },
    ],
    team: [
      { _id:'demo-owner', name:'Executive Director', email:'owner@construction.com', role:'owner', active:true, assignedSites:['site-1','site-2','site-3'] },
      { _id:'demo-hr', name:'Site HR & Operations Lead', email:'hr@construction.com', role:'hr', active:true, assignedSites:['site-1','site-2'] },
      { _id:'demo-worker', name:'Field Worker / Crew', email:'worker@construction.com', role:'worker', active:true, assignedSites:['site-1'] },
    ],
  };
}
