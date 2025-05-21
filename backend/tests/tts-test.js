require('dotenv').config();
const azureTTS = require('../services/azureTTS');
const fs = require('fs');
const path = require('path');

async function testTTS() {
    try {
        // Check environment variables
        if (!process.env.AZURE_TTS_KEY) {
            throw new Error('AZURE_TTS_KEY environment variable is not set');
        }
        if (!process.env.AZURE_TTS_REGION) {
            throw new Error('AZURE_TTS_REGION environment variable is not set');
        }

        console.log('Starting TTS test...');
        console.log('Environment variables check: PASSED');
        console.log('Using Region:', process.env.AZURE_TTS_REGION);
        
        // Test text to convert to speech
        const testText = "Hello! This is a test of the Azure Text to Speech service.";
        console.log('\nConverting text to speech:', testText);
        
        // Try to convert text to speech
        const audioBuffer = await azureTTS.getSpeechFromText(testText);
        
        if (!audioBuffer || audioBuffer.length === 0) {
            throw new Error('No audio data received from the service');
        }

        console.log('Success! Audio buffer received.');
        console.log('Audio buffer length:', audioBuffer.length, 'bytes');
        
        // Save the audio file for testing
        const outputFile = path.join(__dirname, 'test-output.mp3');
        fs.writeFileSync(outputFile, audioBuffer);
        console.log('Test audio file saved as:', outputFile);
        
        console.log('\nTest completed successfully! ✨');
    } catch (error) {
        console.error('\n❌ Test failed:');
        console.error('Error message:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

// Run the test
testTTS();
