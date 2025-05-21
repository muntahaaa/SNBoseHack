const { getSpeechFromText } = require("../services/azureTTS");

async function ttsHandler(req, res) {
  const { text, language = "en-US", voice = "en-US-AriaNeural" } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Missing required text field" });
  }
  
  try {
    const audioBuffer = await getSpeechFromText(text, language, voice);
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline; filename=\"speech.mp3\""
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error("TTS API Error:", err);
    res.status(500).json({ error: "TTS request failed", details: err.message });
  }
}

module.exports = { ttsHandler };
