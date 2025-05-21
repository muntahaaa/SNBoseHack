# SNBoseHack

## Features

### Text-to-Speech Integration

The chatbot now includes a "Hear the answer" button that allows users to listen to the AI's response. This feature uses Microsoft Azure's Text-to-Speech API to convert text responses into natural-sounding speech.

#### How It Works:

1. When the chatbot provides a text response, a "Hear the answer" button appears at the bottom of the message
2. Clicking this button sends the response text to the backend
3. The backend uses Azure's TTS API to generate an audio file
4. The audio is streamed back to the frontend and played automatically
5. Once loaded, users can play, pause, and reset the audio as needed

#### Controls:

- **Hear the answer**: Initial button to convert text to speech
- **Play/Pause**: Toggle button to control audio playback
- **Reset**: Button to clear the current audio and free up resources

#### Configuration:

The TTS feature uses the following environment variables:
- `AZURE_TTS_KEY`: Your Azure Cognitive Services API key
- `AZURE_TTS_REGION`: Your Azure region (e.g., "southeastasia")

#### Default Voice Settings:

- Language: en-US
- Voice: en-US-AriaNeural

These settings can be customized by modifying the parameters in the ChatMessage component.