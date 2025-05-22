const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'drcrjpvdy',
  api_key: '283564365986229',
  api_secret: '2SiEGri9lFkTWxIWz8pWpzEkYAQ'
});

module.exports = cloudinary;