require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { syncModels } = require("./models");
const carsRouter = require("./routes/cars");
const inquiriesRouter = require("./routes/inquiries");
const statsRouter = require("./routes/stats");
const cmsRouter = require("./routes/cms");
const brandsRouter = require("./routes/brands");
const { router: uploadsRouter, uploadDir } = require("./routes/uploads");

const port = Number(process.env.PORT) || 4001;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:4000,http://localhost:4002")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin = "") {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname === "teensclub.mn" || hostname.endsWith(".teensclub.mn");
  } catch {
    return false;
  }
}

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS blocked"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/cars", carsRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/cms", cmsRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/uploads", uploadsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Зураг 8MB-аас бага байх ёстой" });
  }
  const status = err.name === "SequelizeUniqueConstraintError" ? 409 : 500;
  res.status(status).json({
    message: err.message || "Дотоод алдаа гарлаа",
  });
});

syncModels()
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  });
