const { v2: cloudinary } = require('cloudinary');
const axios = require('axios');

cloudinary.config({
  cloud_name: 'dry1vp0gv',
  api_key: '534561152854399',
  api_secret: 'mG1cwrS4mjGTX_oFF187bHq7ses',
  secure: true,
});

async function main() {
  // Create a dummy PDF buffer
  const dummyBuffer = Buffer.from('%PDF-1.4 ... dummy pdf content ... %%EOF');
  
  console.log('Uploading as image...');
  const imgResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'test_pdfs', resource_type: 'image', type: 'authenticated' },
      (error, result) => error ? reject(error) : resolve(result)
    ).end(dummyBuffer);
  });
  console.log('Image Upload Result:', imgResult.public_id);

  console.log('Uploading as raw...');
  const rawResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'test_pdfs', resource_type: 'raw', type: 'authenticated' },
      (error, result) => error ? reject(error) : resolve(result)
    ).end(dummyBuffer);
  });
  console.log('Raw Upload Result:', rawResult.public_id);

  // Generate signed URL for image
  const imgSignedUrl = cloudinary.url(imgResult.public_id, {
    resource_type: 'image',
    type: 'authenticated',
    sign_url: true,
    secure: true,
  });
  console.log('Image Signed URL:', imgSignedUrl);

  // Generate signed URL for raw
  const rawSignedUrl = cloudinary.url(rawResult.public_id, {
    resource_type: 'raw',
    type: 'authenticated',
    sign_url: true,
    secure: true,
  });
  console.log('Raw Signed URL:', rawSignedUrl);

  // Fetch Image Signed URL
  try {
    const res1 = await axios.get(imgSignedUrl);
    console.log('Fetch Image URL: Success', res1.status);
  } catch (err) {
    console.log('Fetch Image URL: Failed', err.response?.status, err.response?.headers?.['x-cld-error']);
  }

  // Fetch Raw Signed URL
  try {
    const res2 = await axios.get(rawSignedUrl);
    console.log('Fetch Raw URL: Success', res2.status);
  } catch (err) {
    console.log('Fetch Raw URL: Failed', err.response?.status, err.response?.headers?.['x-cld-error']);
  }
}

main().catch(console.error);
