const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'dry1vp0gv',
  api_key: '534561152854399',
  api_secret: 'mG1cwrS4mjGTX_oFF187bHq7ses',
  secure: true,
});

const publicId = 'pdfs/euvwr9bjhrfacpnnxduf';

async function main() {
  const result = await cloudinary.api.resource(publicId, {
    resource_type: 'image',
    type: 'authenticated',
  });
  console.log('Resource Info:');
  console.dir(result, { depth: null });
}

main().catch(console.error);
