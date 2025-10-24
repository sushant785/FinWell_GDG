const express = require("express");
const multer = require("multer");
const path = require("path");
const userAuth = require("../middlewares/userAuth.js")
const { signup, login, getProfile, updateProfile } = require("../controllers/user.controller.js");

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
router.get("/profile",userAuth, getProfile);
router.put("/profile", userAuth, updateProfile);

module.exports = router;
