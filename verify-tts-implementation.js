// This script verifies the TTS implementation in simulation files
const fs = require('fs');
const path = require('path');

// The base directories containing our HTML files
const directories = [
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Chemistry'),
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Math'),
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Physics')
];

// List of files to verify
const targetFiles = [
  'litmus.html',
  'numberLineQuiz.html',
  'shapeQuiz.html',
  'ohms-law.html',
  'weight-mass.html'
];

// Required elements to check
const requiredElements = [
  {
    name: 'Popup content element',
    regex: /<p id="popup-content">/
  },
  {
    name: 'TTS Button',
    regex: /<button id="ttsButton"/
  },
  {
    name: 'TTS Status element',
    regex: /<div id="tts-status"/
  },
  {
    name: 'closePopup function with audio handling',
    regex: /function closePopup\(\)[\s\S]*?window\.ttsAudio/
  },
  {
    name: 'speakText function',
    regex: /async function speakText\(\)/
  },
  {
    name: 'Event listener for TTS button',
    regex: /ttsButton\.addEventListener\('click', speakText\)/
  },
  {
    name: 'API endpoint call',
    regex: /fetch\('http:\/\/localhost:5000\/api\/tts'/
  },
  {
    name: 'Fallback to browser speech synthesis',
    regex: /window\.speechSynthesis/
  }
];

// Function to verify files
async function verifyTtsImplementation() {
  const results = {};
  
  for (const dir of directories) {
    for (const file of targetFiles) {
      const filePath = path.join(dir, file);
      
      try {
        // Skip if file doesn't exist
        if (!fs.existsSync(filePath)) {
          continue;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileResults = { pass: true, missing: [] };
        
        // Check for required elements
        for (const element of requiredElements) {
          if (!element.regex.test(content)) {
            fileResults.pass = false;
            fileResults.missing.push(element.name);
          }
        }
        
        results[filePath] = fileResults;
      } catch (error) {
        console.error(`Error verifying ${file}:`, error);
        results[filePath] = { pass: false, error: error.message };
      }
    }
  }
  
  // Print results
  console.log('\n===== TTS Implementation Verification Results =====\n');
  
  let allPassed = true;
  
  for (const [file, result] of Object.entries(results)) {
    const relativePath = file.split('SNBoseHack')[1];
    console.log(`File: ${relativePath}`);
    
    if (result.error) {
      console.log(`  Status: ❌ Error - ${result.error}`);
      allPassed = false;
    } else if (result.pass) {
      console.log('  Status: ✅ All required elements found');
    } else {
      console.log('  Status: ❌ Missing elements:');
      for (const missing of result.missing) {
        console.log(`    - ${missing}`);
      }
      allPassed = false;
    }
    console.log('');
  }
  
  console.log('=================================================');
  console.log(`Overall Result: ${allPassed ? '✅ All files pass verification' : '❌ Some files have issues'}`);
  console.log('=================================================\n');
  
  if (!allPassed) {
    console.log('Next Steps:');
    console.log('1. Review the missing elements in the files with issues');
    console.log('2. Run the add-tts-to-simulations.js script again with specific file targets');
    console.log('3. Verify that the HTML structure matches the expected patterns for TTS implementation');
    console.log('4. Check for any syntax errors or malformed HTML in the files');
  } else {
    console.log('Next Steps for Manual Testing:');
    console.log('1. Start the backend server to test the primary TTS API functionality');
    console.log('2. Open each simulation in a browser and click the "Learn" button to display the popup');
    console.log('3. Click the "শুনুন" (Listen) button to test TTS functionality');
    console.log('4. Verify that audio plays correctly and the button changes state appropriately');
    console.log('5. Test the fallback functionality by temporarily disabling the backend server');
  }
}

// Execute the script
verifyTtsImplementation().then(() => {
  console.log('TTS verification complete!');
}).catch(err => {
  console.error('Error during TTS verification:', err);
});
