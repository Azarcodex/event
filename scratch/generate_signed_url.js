const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'dry1vp0gv',
  api_key: '534561152854399',
  api_secret: 'mG1cwrS4mjGTX_oFF187bHq7ses',
  secure: true,
});

const publicId = 'pdfs/euvwr9bjhrfacpnnxduf';

const signedUrlWithVersion = cloudinary.url(publicId, {
  resource_type: 'image',
  type: 'authenticated',
  sign_url: true,
  secure: true,
  format: 'pdf',
  version: 1779722176,
});

console.log('Signed URL with version:', signedUrlWithVersion);
