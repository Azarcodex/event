const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'dwbwpsztz',
  api_key: '967845687396779',
  api_secret: 'oitpOdR-etD8vacwubFfCKn5mwE',
  secure: true,
});

const publicId = 'pdfs/euvwr9bjhrfacpnnxduf'; // or any dummy ID

const url = cloudinary.utils.private_download_url(
  publicId,
  'pdf',
  {
    resource_type: 'image',
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + 60, // Expires in 60 seconds
    attachment: false // Display inline
  }
);

console.log('Private Download URL:', url);
