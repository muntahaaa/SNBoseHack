const axios = require("axios");

/**
 * Converts text to speech using Azure Cognitive Services
 * 
 * @param {string} text - The text to convert to speech
 * @param {string} language - The language code (e.g., "en-US", "bn-IN")
 * @param {string} voice - The voice name to use (e.g., "en-US-AriaNeural", "bn-IN-TanishaaNeural")
 * @returns {Promise<Buffer>} - A promise that resolves to the audio buffer
 */
async function getSpeechFromText(text, language = "en-US", voice = "en-US-AriaNeural") {
  const apiKey = process.env.AZURE_TTS_KEY;
  const region = process.env.AZURE_TTS_REGION;
  
  if (!apiKey || !region) {
    throw new Error("Azure TTS API key or region not configured. Please check environment variables.");
  }
  
  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  // Special handling for different languages if needed
  let processedText = text;
  
  // Bengali often needs special encoding considerations
  if (language === "bn-IN") {
    // Log that we're processing Bengali text
    console.log("Processing Bengali text for TTS, length:", text.length);
    
    // Validate that we actually have Bengali characters
    const bengaliCharRegex = /[\u0980-\u09FF]/;
    if (!bengaliCharRegex.test(text)) {
      console.warn("No Bengali characters detected in text marked as Bengali language");
    }
    
    // Ensure proper escaping of special characters for SSML
    processedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  } else {
    // For other languages (including English), just escape SSML characters
    processedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  const ssml = `
    <speak version="1.0" xml:lang="${language}">
      <voice xml:lang="${language}" xml:gender="Female" name="${voice}">
        ${processedText}
      </voice>
    </speak>
  `;
  try {
    console.log(`Making TTS request to Azure with language=${language}, voice=${voice}`);
    
    const response = await axios({
      method: "post",
      url: endpoint,
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
        "User-Agent": "speak-it-mern-azure"
      },
      data: ssml,
      responseType: "arraybuffer",
      timeout: 15000 // 15 second timeout
    });

    console.log('TTS response received, size:', response.data.length);
    
    // Verify we got a valid audio buffer
    if (!response.data || response.data.length === 0) {
      console.error('TTS API returned empty data');
      throw new Error('TTS service returned empty audio data');
    }

    // Returns raw audio buffer (MP3)
    return response.data;
  } catch (err) {
    console.error('TTS Error Details:', {
      statusCode: err.response?.status,
      statusText: err.response?.statusText,
      errorData: err.response?.data?.toString ? err.response?.data?.toString() : 'No data',
      headers: err.response?.headers
    });
    throw err;
  }
}

module.exports = { getSpeechFromText };
