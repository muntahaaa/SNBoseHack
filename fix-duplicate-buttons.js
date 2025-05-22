// This script fixes duplicate TTS buttons in the simulation files
const fs = require('fs');
const path = require('path');

// The base directories containing our HTML files
const directories = [
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Chemistry'),
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Math'),
  path.join(__dirname, 'frontend', 'public', 'simulations', 'Physics')
];

// List of files to check
const targetFiles = [
  'litmus.html',
  'numberLineQuiz.html',
  'shapeQuiz.html',
  'ohms-law.html',
  'weight-mass.html'
];

// Function to process and fix files
async function fixDuplicateButtons() {
  for (const dir of directories) {
    for (const file of targetFiles) {
      const filePath = path.join(dir, file);
      
      try {
        // Read the file
        if (!fs.existsSync(filePath)) {
          console.log(`File ${filePath} does not exist, skipping`);
          continue;
        }
        
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Check for duplicate popup content
        const popupRegex = /<div id="popup"[^>]*>[\s\S]*?<\/div>/g;
        const popupMatches = content.match(popupRegex);
        
        if (popupMatches && popupMatches.length > 1) {
          console.log(`Found duplicate popup in ${file}, fixing...`);
          
          // Keep only the first popup
          const firstPopup = popupMatches[0];
          
          // Replace all popups with the first one
          content = content.replace(popupRegex, '');
          
          // Add back the first popup at the end of the body
          content = content.replace('</body>', `${firstPopup}\n</body>`);
          
          // Write the modified content back to the file
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`Fixed ${file}`);
        } else {
          console.log(`No duplicate popups found in ${file}`);
        }
        
        // Check for duplicate TTS buttons within a popup
        const ttsButtonRegex = /<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">[\s\S]*?<\/div>/g;
        
        content = fs.readFileSync(filePath, 'utf-8');
        const popupContent = content.match(/<div id="popup"[^>]*>[\s\S]*?<\/div>/);
        
        if (popupContent) {
          const ttsButtonMatches = popupContent[0].match(ttsButtonRegex);
          
          if (ttsButtonMatches && ttsButtonMatches.length > 1) {
            console.log(`Found duplicate TTS buttons in ${file}, fixing...`);
            
            // Keep only the first button set
            const firstButtonSet = ttsButtonMatches[0];
            
            // Replace all button sets with the first one
            let updatedPopupContent = popupContent[0].replace(ttsButtonRegex, '');
            updatedPopupContent += firstButtonSet;
            
            // Update the file content
            content = content.replace(/<div id="popup"[^>]*>[\s\S]*?<\/div>/, updatedPopupContent);
            
            // Write the modified content back to the file
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Fixed duplicate TTS buttons in ${file}`);
          } else {
            console.log(`No duplicate TTS buttons found in ${file}`);
          }
        }
      } catch (error) {
        console.error(`Error fixing ${file}:`, error);
      }
    }
  }
}

// Execute the script
fixDuplicateButtons().then(() => {
  console.log('TTS button fix complete!');
}).catch(err => {
  console.error('Error fixing TTS buttons:', err);
});
