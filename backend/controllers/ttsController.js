const { getSpeechFromText } = require("../services/azureTTS");

// Available voices per language
const SUPPORTED_VOICES = {
  "en-US": ["en-US-AriaNeural", "en-US-GuyNeural", "en-US-JennyNeural", "en-US-AnaNeural"],
  "bn-IN": ["bn-IN-TanishaaNeural", "bn-IN-BashkarNeural", "bn-IN-PrabhatNeural"]
};

// Voice genders for proper selection
const VOICE_GENDERS = {
  "en-US-AriaNeural": "female",
  "en-US-GuyNeural": "male",
  "en-US-JennyNeural": "female",
  "en-US-AnaNeural": "female",
  "bn-IN-TanishaaNeural": "female",
  "bn-IN-BashkarNeural": "male",
  "bn-IN-PrabhatNeural": "male"
};

async function ttsHandler(req, res) {
  const { text, language = "en-US", voice, gender } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Missing required text field" });
  }
  
  // Validate language and voice
  if (!SUPPORTED_VOICES[language]) {
    return res.status(400).json({ 
      error: "Unsupported language", 
      message: `Language '${language}' is not supported. Supported languages are: ${Object.keys(SUPPORTED_VOICES).join(', ')}` 
    });
  }
  
  // If no voice is specified, use a gender-appropriate voice or default
  let selectedVoice = voice;
  if (!voice || !SUPPORTED_VOICES[language].includes(voice)) {
    if (gender && (gender === 'male' || gender === 'female')) {
      // Try to find a voice of the requested gender
      const genderVoices = SUPPORTED_VOICES[language].filter(
        v => VOICE_GENDERS[v] === gender.toLowerCase()
      );
      
      if (genderVoices.length > 0) {
        selectedVoice = genderVoices[0];
        console.log(`Using ${gender} voice for ${language}: ${selectedVoice}`);
      } else {
        selectedVoice = SUPPORTED_VOICES[language][0];
        console.log(`No ${gender} voice found for ${language}, using default: ${selectedVoice}`);
      }
    } else {
      selectedVoice = SUPPORTED_VOICES[language][0];
      console.log(`Voice not specified, using default voice for ${language}: ${selectedVoice}`);
    }
  }
  try {
    console.log(`Processing TTS request: language=${language}, voice=${selectedVoice}, text length=${text.length}`);
    const audioBuffer = await getSpeechFromText(text, language, selectedVoice);
    
    if (!audioBuffer || audioBuffer.length === 0) {
      console.error("TTS service returned empty audio data");
      return res.status(500).json({ error: "TTS service returned empty audio data" });
    }
    
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline; filename=\"speech.mp3\""
    });
    res.send(audioBuffer);
  } catch (err) {
    console.error("TTS API Error:", err);
    
    // More informative error response
    const errorResponse = { 
      error: "TTS request failed", 
      details: err.message 
    };
    
    // Add Azure-specific error info if available
    if (err.response) {
      errorResponse.statusCode = err.response.status;
      errorResponse.statusText = err.response.statusText;
    }
    
    res.status(500).json(errorResponse);
  }
}

module.exports = { ttsHandler };
