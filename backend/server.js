const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Enable CORS for frontend integration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));

const PORT = process.env.PORT || 5000;

// API Routes
app.use("/", require("./routes/homeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/workers", require("./routes/workerRoutes"));
app.use("/api/sites", require("./routes/siteRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/materials", require("./routes/materialRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/wages", require("./routes/wageRoutes"));
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});