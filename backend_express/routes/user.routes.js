const express = require("express");
const multer = require("multer");
const { signup, login } = require("../controllers/user.controller.js");

const router = express.Router();

const upload = multer({ dest: "uploads/" }); +

router.post("/signup", upload.single("file"), signup);
router.post("/login", login);

module.exports = router;
