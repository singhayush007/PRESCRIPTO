import multer from "multer";
import os from "os";
import path from "path";
import crypto from "crypto";

// Store uploads in the OS temp dir with a random name (never trust originalname:
// it allows overwriting files and path tricks). Files are deleted after the
// Cloudinary upload by the controllers.
const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, callback) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
      callback(null, true);
    } else {
      const err = new Error("Only JPG, PNG or WEBP images are allowed");
      err.status = 400;
      callback(err);
    }
  },
});

export default upload;
