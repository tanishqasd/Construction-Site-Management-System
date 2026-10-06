function calculatePayroll(worker, attendance) {
  const result = { presentDays: 0, halfDays: 0, absentDays: 0, totalSalary: 0, legacyRateDays: 0 };
  for (const entry of attendance) {
    const multiplier = entry.status === 'Present' ? 1 : entry.status === 'Half Day' ? 0.5 : 0;
    if (entry.status === 'Present') result.presentDays++;
    if (entry.status === 'Half Day') result.halfDays++;
    if (entry.status === 'Absent') result.absentDays++;
    if (multiplier && entry.dailyRate == null) result.legacyRateDays++;
    result.totalSalary += Math.round((entry.dailyRate ?? worker.dailyWage) * multiplier * 100);
  }
  result.totalSalary /= 100; return result;
}
module.exports = { calculatePayroll };
