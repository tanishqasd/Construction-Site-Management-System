# Maple Construction Site Management

Client application for Owner / Director, Site HR / Manager and Field Worker accounts. React, TypeScript, Vite, Tailwind and Recharts connect to an Express, JWT and MongoDB API.

## Application behavior

There is no demonstration login, role switcher, seeded business data, offline simulated authentication or local record store. Every business record comes from the authenticated API. Server failures show actionable errors and retry controls rather than fabricated records. Protected pages verify the stored session with the server before opening.

| Role | Modules and permissions |
| --- | --- |
| Owner / Director | Portfolio analytics; create/manage sites, workers, contractors, attendance, tasks, materials, expenses, payroll, issues, reports and documents; create, assign, enable/disable and reset team accounts. |
| Site HR / Manager | Assigned sites only; update operational progress/status; manage workforce, contractors, attendance, tasks, inventory, issues, reports and documents; view earned payroll. Expense and account administration remain owner-only. |
| Field Worker | Own assigned tasks, attendance, earned wages, reported issues and safety reports; read documents for the assigned site. No administrative role selection. |

Search, filters, table sorting/pagination, Kanban tasks, CSV exports, responsive navigation, document links/uploads/downloads and real empty/loading/error states are provided. Records created in one workspace cannot be read or changed by another workspace's accounts. Related-record IDs are validated by the API.

Public owner registration is disabled by default. New team accounts and reset passwords require a password change before site records can be accessed. Changing a password, disabling an account or changing its sign-in email revokes prior tokens. Sessions synchronize logout across browser tabs and expire automatically.

## Local setup

1. Install dependencies with `npm ci` in `backend` and `frontend`.
2. Set `MONGO_URI` and a random `JWT_SECRET` of at least 32 bytes in the private `backend/.env` file. Set `FRONTEND_URL` to the exact frontend origin. Never paste credentials into public frontend variables.
3. Run `npm run dev` in `backend`. It only listens after MongoDB connects. `/api/health` is ready only when the database is connected.
4. Run `npm run dev` in `frontend`. Development uses `http://localhost:5000/api`. A different public API can be set in `frontend/.env.local` using `VITE_API_URL`.
5. Sign in with a real account. If the database has no owner, supply `OWNER_NAME`, `OWNER_EMAIL` and `OWNER_PASSWORD` privately in the backend environment and run `npm run create-owner`. Remove those temporary setup variables afterwards. The script refuses to overwrite an existing account.
6. Create sites and workforce profiles, then create managers with assigned sites and worker accounts linked to active workforce profiles. Share their temporary passwords privately. Each new member changes that password before using the workspace.

`ALLOW_OWNER_REGISTRATION=true` explicitly enables self-service owner workspace registration when needed. Leave it `false` for the client deployment. There are no built-in credentials.

## Database integrity

New attendance stores the daily wage rate used for that shift. Later worker-rate edits do not recalculate earlier shifts. Historical records without a stored rate use the current rate and are flagged for review in payroll. Wages are earned amounts; expense payment records are bookkeeping, not money transfers.

Attendance saves normalize dates, reject future muster dates and atomically update a worker/day record. A partial unique index prevents duplicates for new workspace records. Inspect historical duplicates before creating indexes. Workers with accounts or operational history and sites with dependencies cannot be deleted. Paid expense records cannot be deleted. Deactivate workers or mark finished sites Completed instead.

Document uploads accept PDF, PNG or JPEG up to 2 MB. Attachments are stored in MongoDB and fetched only when downloading a file. Larger document libraries should use object storage. Attachment URLs and file size/type are validated. CSV exports escape spreadsheet formula prefixes.

Existing legacy users need explicit workspace associations: `organizationId` must be the owner's user ID; managers need `assignedSites`; worker profiles need the corresponding `userId`. Original owner-authored records without `organizationId` retain scoped legacy access. No automatic cross-account migration is performed. Back up and verify associations before modifying a client database.

## Production deployment

Render backend: root `backend`, build `npm ci`, start `npm start`, health `/api/health`; private `MONGO_URI`, `JWT_SECRET`, exact `FRONTEND_URL`, `ALLOW_OWNER_REGISTRATION=false`, and `NODE_ENV=production`. The app trusts one reverse proxy in production. Sign-in throttling is process-local; multiple backend instances need a shared limiter.

Vercel frontend: the committed `frontend/.env.production` contains only the public API address, `VITE_API_URL=https://maple-construction-backend.onrender.com/api`. Vercel environment variables override this file; remove any stale override or set it to this same address, then rebuild. A Render dashboard URL is not an API address. The build rejects absent, HTTP, credential-bearing or localhost production API URLs. Never add secrets to the public production environment file. Environment changes require a fresh frontend build.

For frontend-root Vercel projects use `npm ci`, `npm run build`, output `dist`. For repository-root projects use the supplied root `vercel.json`. Both configurations include SPA routing and security headers. Never deploy a bundle made with a validation-only API address.

## Verification and deployment status

Run `npm test` in both folders and `npm run build` in `frontend` with the real production `VITE_API_URL`. API tests use isolated in-memory fixtures and do not write client Atlas records. They check auth, workspace/role boundaries, credential revocation, temporary-password enforcement, reference validation, daily attendance corrections, wage snapshots, financial safeguards and document validation. Frontend tests check sessions, API behavior and wage calculations.

On 7 October 2026, an initial MongoDB DNS failure was followed by successful cluster DNS resolution and a read-only Atlas connection/ping using the private local configuration. The local API started successfully; `/api/health` returned a connected database, owner registration remained disabled, and a preflight from the configured Vercel origin returned the expected origin and credentials headers. The database contains one owner account. Account passwords, authenticated CRUD and deployed cloud connectivity have not been verified. No account credentials or business records were changed.

The public Render backend is `https://maple-construction-backend.onrender.com`. On 7 October 2026 it responded, but `/api/health` and `/api/auth/config` returned 404 and the Vercel-origin preflight omitted `Access-Control-Allow-Origin`. These responses do not match the current backend implementation; deploy the current repository commit with the documented root, commands and private environment settings before validating frontend login. Access to the correct deployment accounts is still required. The supplied Vercel application URL currently returns `404 NOT_FOUND`; repository updates alone do not confirm a successful cloud deployment.

Verify the real environment with owner, manager and worker accounts: sign-in and refresh, initial password change, site/workforce creation, manager assignment, attendance correction, wage-rate history, tasks/issues/reports, document upload/download, owner expense recording, logout/session revocation and phone-width tables/navigation.

## Source cleanup and credentials

Unused legacy pages, mock assets and unmounted controllers/routes were preserved in ignored `archive/legacy` and are outside the active frontend/API. They are not included in production bundles. The active operational API is `backend/routes/operationsRoutes.js`.

The local `backend/.env` has been removed from the Git index and remains on disk. Previously committed credentials may still exist in Git history; rotate any such real database credentials and JWT secret before client deployment. Do not publish the archive, local environment files or validation build output.
