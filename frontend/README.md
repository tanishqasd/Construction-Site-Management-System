# Maple client frontend

Run `npm ci` and `npm run dev` in this folder. Sign in using a real backend account. Demonstration accounts, persona switching and sample records have been removed.

Development defaults to `http://localhost:5000/api`. Production requires the real public HTTPS backend URL in `VITE_API_URL`; this is embedded at build time. Run `npm test` for request/session/payroll checks and `npm run build` for TypeScript and bundling.

The active app uses `AuthContext`, `WorkspaceContext`, `Dashboard`, `ResourcePage`, `AttendancePage` and `AccountPage`. Protected routes verify account status with the API; new/reset accounts must change their password before accessing site data. Every write goes to the backend.

See the [root README](../README.md) for account setup, permissions, database requirements, deployment and the remaining connection blocker.
