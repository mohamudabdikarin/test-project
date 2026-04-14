require("express-async-errors");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// --------------- Global Middleware ---------------
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --------------- Health Check ---------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: env.NODE_ENV });
});

// --------------- Routes ---------------
const authRoutes = require("./modules/auth/auth.routes");
const projectRoutes = require("./modules/projects/projects.routes");
const companyRoutes = require("./modules/company/company.routes");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/company", companyRoutes);

// --------------- 404 Handler ---------------
app.all("*", (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// --------------- Error Handler ---------------
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${env.NODE_ENV}]`);
});

module.exports = app;
