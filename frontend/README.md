# Maple client frontend

Run `npm ci` and `npm run dev` in this folder. Choose Client sign-in for a real backend account or a demo persona for isolated sample exploration. Demo access is currently enabled by the public `VITE_ENABLE_DEMO=true` flag in development and production; set it to `false` and rebuild to remove demo access.

Development defaults to `http://localhost:5000/api`. Production requires the real public HTTPS backend URL in `VITE_API_URL`; this is embedded at build time. Run `npm test` for request/session/payroll checks and `npm run build` for TypeScript and bundling.

The active app uses `AuthContext`, `WorkspaceContext`, `Dashboard`, `ResourcePage`, `AttendancePage` and `AccountPage`. Protected client routes verify account status with the API; new/reset accounts must change their password before accessing site data. Client writes go to the backend. Explicit demo sessions use `src/demo` and store sample edits separately in this browser; the request adapter prevents protected demo requests from reaching the backend. Demo entry removes client tokens and logout clears the demo marker. Role permissions and assignment filters apply to both modes.

See the [root README](../README.md) for account setup, permissions, database requirements, deployment and the remaining connection blocker.
