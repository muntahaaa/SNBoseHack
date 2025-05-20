const fs = require('fs');
const path = require('path');

const videosDir = path.join(__dirname, 'backend', 'public', 'videos');

// Create directory structure if it doesn't exist
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
  console.log('Created videos directory structure');
}

// Create placeholder files
const videoFiles = [
  'cover.mp4',
  'math-video.webm',
  'physics-cover.mp4',
  'chemistry-cover.mp4'
];

videoFiles.forEach(file => {
  const filePath = path.join(videosDir, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'Placeholder content for ' + file);
    console.log(`Created placeholder for ${file}`);
  }
});

console.log('Setup complete. Please replace placeholder files with actual video content.');
