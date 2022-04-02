const express = require("express");
const {
  getApplicationById,
  createApplicaton,
  uploadFile,
} = require("./application.controller");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary/cloudinary.config");
const upload = multer({ storage });

router.get("/", (req, res) => {
  res.render("application");
});

router.get("/application/:id", getApplicationById);
router.post("/application", createApplicaton);
router.post("/application/files", upload.fields([
    {name: "profile_picture", maxCount: 1},
    {name: "passport", maxCount: 1},
    {name: "diploma", maxCount: 1},
    {name: "transcript", maxCount: 1}
]), uploadFile);

module.exports = router;
