const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");
const { authenticate } = require("../middleware/auth");

router.get("/my-certificates", authenticate, certificateController.getMyCertificates);

module.exports = router;
