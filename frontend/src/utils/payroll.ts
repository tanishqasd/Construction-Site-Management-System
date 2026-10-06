import type { AttendanceRecord, WorkerRecord } from '../types/workspace';
export function earnedWage(entry: AttendanceRecord, dailyWage: number) {
  const multiplier=entry.status==='Present'?1:entry.status==='Half Day'?.5:0;
  return Math.round((entry.dailyRate ?? dailyWage)*multiplier*100)/100;
}
export function monthlyPayroll(worker: WorkerRecord, records: AttendanceRecord[]) {
  return { present:records.filter((entry)=>entry.status==='Present').length,half:records.filter((entry)=>entry.status==='Half Day').length,absent:records.filter((entry)=>entry.status==='Absent').length,amount:Math.round(records.reduce((sum,entry)=>sum+earnedWage(entry,worker.dailyWage),0)*100)/100,legacyRateDays:records.filter((entry)=>entry.dailyRate==null&&entry.status!=='Absent').length };
}
