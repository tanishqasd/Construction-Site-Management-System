# Construction Site Management System (Enterprise MERN Stack)

A full-stack construction site operations and cost-control management dashboard engineered with React 18, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB Atlas.

## 🚀 Key Features

- **Authentication & RBAC:** JWT-based user authentication with route guards and data isolation.
- **Project Portfolio:** Real-time tracking of budgets, timelines, and execution phases across active sites.
- **Labour & Attendance Muster:** Daily attendance logging, turnout analytics, and automatic wage burn computation.
- **Cost Control & Expense Ledger:** Categorized expenditure tracking with multi-tier audit trails.
- **Inventory & Procurement:** Live material stock valuation and unit cost monitoring.
- **Incident & Task Management:** SLA tracking, overdue calculations, and critical path issue registers.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend:** Node.js, Express.js (v5), Mongoose ODM, JSON Web Tokens, Bcrypt.js
- **Database:** MongoDB Atlas

## 📋 Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds initial database fixtures
npm run dev      # Runs server on http://localhost:5000