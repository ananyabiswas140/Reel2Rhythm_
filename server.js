require("dotenv").config(); 

const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("public"));

// Ensure folders exist
const uploadDir = path.join(__dirname, "upload");
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Multer config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Convert route
app.post("/convert", upload.single("video"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(
    outputDir,
    `${Date.now()}.mp3`
  );

ffmpeg(inputPath)
  .toFormat("mp3")
  .on("end", () => {
    res.download(outputPath, () => {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
  })
  .on("error", err => {
    console.error(err);
    res.status(500).send("Conversion failed");
  })
    .save(outputPath);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
