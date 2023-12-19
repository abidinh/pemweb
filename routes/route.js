const express = require("express");
const router = express.Router();
const eventController = require("./event/event");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/events", upload.single("image"), eventController.createEvent);

module.exports = router;
