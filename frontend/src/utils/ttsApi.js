import axios from "axios";

export const fetchTTS = async ({ text, language, voice }) => {
  try {
    console.log('Sending TTS request with text length:', text.length);
    const response = await axios.post(
      "http://localhost:5000/api/tts",
      { text, language, voice },
      { 
        responseType: "blob",
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('TTS response received, type:', response.headers['content-type']);
    
    if (response.data.size === 0) {
      throw new Error('Received empty audio data from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('TTS API error:', error);
    
    // Check for specific error types
    if (error.response) {
      console.error('Server responded with error:', error.response.status, error.response.statusText);
      throw new Error(`Server error: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error('No response from TTS server');
    }
    
    throw error;
  }
};
