const { Router } = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const uploadDir = path.join(__dirname, "../../../car/public/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

if (cloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function uploadBufferToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "nda-auto", resource_type: "image" },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("Cloudinary-д хуулж чадсангүй"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    stream.end(file.buffer);
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
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

router.post("/", upload.array("files", 12), async (req, res, next) => {
  try {
    const incoming = req.files || [];
    if (!incoming.length) {
      return res.status(400).json({ message: "Файл олдсонгүй" });
    }

    if (cloudinaryConfigured()) {
      const files = await Promise.all(incoming.map(uploadBufferToCloudinary));
      return res.status(201).json({ files });
    }

    const files = incoming.map((file) => {
      const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      fs.writeFileSync(path.join(uploadDir, name), file.buffer);
      return `/uploads/${name}`;
    });
    res.status(201).json({ files });
  } catch (error) {
    next(error);
  }
});

module.exports = { router, uploadDir };
