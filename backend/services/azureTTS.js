const axios = require("axios");

async function getSpeechFromText(text, language = "en-US", voice = "en-US-AriaNeural") {
  const apiKey = process.env.AZURE_TTS_KEY;
  const region = process.env.AZURE_TTS_REGION;
  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const ssml = `
    <speak version="1.0" xml:lang="${language}">
      <voice xml:lang="${language}" xml:gender="Female" name="${voice}">
        ${text}
      </voice>
    </speak>
  `;

  try {
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
      responseType: "arraybuffer"
    });

    // Returns raw audio buffer (MP3)
    return response.data;  } catch (err) {
    console.error('TTS Error Details:', {
      statusCode: err.response?.status,
      statusText: err.response?.statusText,
      errorData: err.response?.data?.toString(),
      headers: err.response?.headers
    });
    throw err;
  }
}

module.exports = { getSpeechFromText };
