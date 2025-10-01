const express = require("express");
const multer = require("multer");
const path = require("path");
const { signup, login } = require("../controllers/user.controller.js");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

router.post("/signup", upload.single("file"), signup);
router.post("/login", login);

module.exports = router;
