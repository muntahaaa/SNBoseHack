const express = require("express");
const { ttsHandler } = require("../controllers/ttsController");
const router = express.Router();

router.post("/tts", ttsHandler);

module.exports = router;
