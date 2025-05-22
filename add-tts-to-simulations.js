// This script adds TTS functionality to all simulation pages
const fs = require('fs');
const path = require('path');

// The base directories containing our HTML files
const directories = [
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Chemistry'),
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Math'),
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Physics')
];

// List of files to modify
const targetFiles = [
  'litmus.html',
  'molarity.html',  // Already has TTS
  'numberLineQuiz.html',
  'shapeQuiz.html',
  'ohms-law.html',
  'weight-mass.html'
];

// The TTS function to add to each file
const ttsFunctionCode = `
// TTS functionality
async function speakText() {
    const ttsButton = document.getElementById('ttsButton');
    const ttsStatus = document.getElementById('tts-status');
    const textToSpeak = document.getElementById('popup-content').textContent;
    
    // If audio is already playing, stop it
    if (window.ttsAudio && !window.ttsAudio.paused) {
        ttsStatus.textContent = 'বন্ধ করা হচ্ছে...';
        window.ttsAudio.pause();
        window.ttsAudio = null;
        ttsButton.style.backgroundColor = '#4CAF50';
        ttsButton.innerHTML = \`
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            শুনুন
        \`;
        ttsStatus.textContent = '';
        return;
    }
    
    try {
        ttsButton.style.backgroundColor = '#ff9800';
        ttsButton.innerHTML = \`
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span class="loading-dots">লোড হচ্ছে</span>
        \`;
        ttsStatus.textContent = '';
        
        // Call the backend TTS API
        const response = await fetch('http://localhost:5000/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: textToSpeak,
                language: 'bn-IN',  // Bengali language code
                voice: 'bn-IN-TanishaaNeural'  // Bengali voice
            })
        });
        
        if (!response.ok) {
            throw new Error(\`TTS request failed: \${response.status} \${response.statusText}\`);
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        ttsStatus.textContent = '';
        
        // Create and play audio
        const audio = new Audio(audioUrl);
        window.ttsAudio = audio;
        
        audio.addEventListener('ended', () => {
            ttsButton.style.backgroundColor = '#4CAF50';
            ttsButton.innerHTML = \`
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                শুনুন
            \`;
            ttsStatus.textContent = '';
            window.ttsAudio = null;
            
            // Clean up
            URL.revokeObjectURL(audioUrl);
        });
        
        audio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            ttsButton.style.backgroundColor = '#f44336';
            ttsButton.innerHTML = \`
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                </svg>
                ত্রুটি হয়েছে
            \`;
            
            // Clean up
            URL.revokeObjectURL(audioUrl);
            
            setTimeout(() => {
                ttsButton.style.backgroundColor = '#4CAF50';
                ttsButton.innerHTML = \`
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    শুনুন
                \`;
                ttsStatus.textContent = '';
            }, 3000);
        });
        
        ttsButton.style.backgroundColor = '#ff5722';
        ttsButton.innerHTML = \`
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            থামান
        \`;
        await audio.play();
    } catch (error) {
        console.error('TTS API error:', error);
        
        // Try using browser's built-in speech synthesis as fallback
        if (window.speechSynthesis) {
            try {
                ttsStatus.textContent = '';
                ttsButton.innerHTML = \`
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                        <circle cx="18" cy="12" r="4" fill="currentColor"></circle>
                    </svg>
                    ব্রাউজারে চলছে
                \`;
                
                // Find Bengali voice if available
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = 'bn-IN';
                
                // Try to find a Bengali voice
                const voices = speechSynthesis.getVoices();
                const bengaliVoice = voices.find(voice => 
                    voice.lang.includes('bn') || 
                    voice.name.toLowerCase().includes('bengali')
                );
                
                if (bengaliVoice) {
                    utterance.voice = bengaliVoice;
                }
                
                utterance.onend = () => {
                    ttsButton.style.backgroundColor = '#4CAF50';
                    ttsButton.innerHTML = \`
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                        শুনুন
                    \`;
                    ttsStatus.textContent = '';
                };
                
                utterance.onerror = () => {
                    ttsButton.style.backgroundColor = '#f44336';
                    ttsButton.innerHTML = \`
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                        </svg>
                        ত্রুটি হয়েছে
                    \`;
                    setTimeout(() => {
                        ttsButton.style.backgroundColor = '#4CAF50';
                        ttsButton.innerHTML = \`
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                                <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                            শুনুন
                        \`;
                        ttsStatus.textContent = '';
                    }, 3000);
                };
                
                ttsButton.style.backgroundColor = '#ff5722';
                speechSynthesis.speak(utterance);
            } catch (synthError) {
                console.error('Speech synthesis error:', synthError);
                ttsButton.style.backgroundColor = '#f44336';
                ttsButton.innerHTML = \`
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                    </svg>
                    সমর্থিত নয়
                \`;
                setTimeout(() => {
                    ttsButton.style.backgroundColor = '#4CAF50';
                    ttsButton.innerHTML = \`
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                        শুনুন
                    \`;
                    ttsStatus.textContent = '';
                }, 3000);
            }
        } else {
            ttsButton.style.backgroundColor = '#f44336';
            ttsButton.innerHTML = \`
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                </svg>
                সমর্থিত নয়
            \`;
            setTimeout(() => {
                ttsButton.style.backgroundColor = '#4CAF50';
                ttsButton.innerHTML = \`
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
                        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    শুনুন
                \`;
                ttsStatus.textContent = '';
            }, 3000);
        }
    }
}`;

// The modified closePopup function
const closePopupFunction = `
function closePopup() {
    document.getElementById('popup').style.display = 'none';
    // Stop audio if playing
    if (window.ttsAudio) {
        window.ttsAudio.pause();
        window.ttsAudio = null;
    }
}`;

// The button and listener code to add to DOMContentLoaded
const domReadyCode = `
// Add TTS button event listener when document is ready
document.addEventListener('DOMContentLoaded', function() {
    const ttsButton = document.getElementById('ttsButton');
    if (ttsButton) {
        ttsButton.addEventListener('click', speakText);
    }
});`;

// The CSS styles
const cssStyles = `
<style>
    @keyframes loading-dots {
        0%, 20% { content: ""; }
        40% { content: "."; }
        60% { content: ".."; }
        80%, 100% { content: "..."; }
    }
    
    .loading-dots::after {
        content: "";
        animation: loading-dots 1.5s infinite;
        display: inline-block;
    }
    
    #ttsButton {
        transition: background-color 0.3s, transform 0.2s;
        font-weight: 500;
        display: flex;
        align-items: center;
    }
    
    #ttsButton:hover {
        background-color: #3e8e41 !important;
        transform: translateY(-1px);
    }
    
    #ttsButton:active {
        transform: scale(0.98);
    }
    
    #tts-status {
        transition: opacity 0.3s;
    }
</style>`;

// The TTS button HTML
const ttsButtonHTML = `
<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
    <button id="ttsButton" style="display: flex; align-items: center; background-color: #4CAF50; color: white; border: none; border-radius: 5px; padding: 8px 12px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" title="শুনুন" aria-label="Read aloud">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
        শুনুন
    </button>
    <div id="tts-status" style="color: #666; font-size: 14px; min-height: 20px; flex-grow: 1; text-align: center;"></div>
    <button onclick="closePopup()" style="background-color: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">বন্ধ করুন</button>
</div>`;

// Function to process and update files
async function processFiles() {
  for (const dir of directories) {
    for (const file of targetFiles) {
      const filePath = path.join(dir, file);
      
      try {
        // Skip molarity.html as it already has TTS
        if (file === 'molarity.html') {
          console.log(`Skipping ${file} as it already has TTS functionality`);
          continue;
        }
        
        // Read the file
        if (!fs.existsSync(filePath)) {
          console.log(`File ${filePath} does not exist, skipping`);
          continue;
        }
        
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Step 1: Add id="popup-content" to the paragraph in popup
        content = content.replace(
          /(<div id="popup"[^>]*>)\s*<p>([^<]+)<\/p>/g,
          `$1\n    <p id="popup-content">$2</p>`
        );
        
        // Step 2: Replace the close button with our button layout
        content = content.replace(
          /<button onclick="closePopup\(\)"[^>]*>[^<]+<\/button>/g,
          ttsButtonHTML
        );
        
        // Step 3: Replace the closePopup function
        content = content.replace(
          /function closePopup\(\) \{\s*document\.getElementById\('popup'\)\.style\.display = 'none';\s*\}/g,
          closePopupFunction
        );
        
        // Step 4: Add the speakText function before the closing </script> tag
        content = content.replace(
          /(document\.getElementById\('learnButton'\)\.addEventListener\('click', showPopup\);)\s*<\/script>/g,
          `$1\n    ${domReadyCode}\n    ${ttsFunctionCode}\n</script>\n${cssStyles}`
        );
        
        // Write the modified content back to the file
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file} with TTS functionality`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
  }
}

// Execute the script
processFiles().then(() => {
  console.log('TTS implementation complete!');
}).catch(err => {
  console.error('Error adding TTS to files:', err);
});
