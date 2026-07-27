const express = require("express");

const upload = require("../middleware/upload.middleware");
const { generatePattern } = require("../controllers/pattern.controller");

const router = express.Router();

router.post("/generate", upload.single("image"), generatePattern);

module.exports = router;
