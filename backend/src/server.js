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

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
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
