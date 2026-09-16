const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../../../car/public/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\//.test(file.mimetype)) {
      cb(new Error("Зөвхөн зураг файл оруулна уу"));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.post("/", upload.array("files", 12), (req, res) => {
  const files = (req.files || []).map((file) => `/uploads/${file.filename}`);
  res.status(201).json({ files });
});

module.exports = { router, uploadDir };
