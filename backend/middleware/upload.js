import multer from "multer";

// Store files in memory (not disk)
const storage = multer.memoryStorage();

// Configure upload settings
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed!"), false);
    } else {
      cb(null, true);
    }
  },
});

export default upload;