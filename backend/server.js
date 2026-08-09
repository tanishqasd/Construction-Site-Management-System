const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workerRoutes = require("./routes/workerRoutes");
const siteRoutes = require("./routes/siteRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const materialRoutes = require("./routes/materialRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/attendance", attendanceRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});