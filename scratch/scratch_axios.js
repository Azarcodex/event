const axios = require('axios');

async function main() {
  const url = 'https://res.cloudinary.com/dry1vp0gv/image/authenticated/s--GPT20ik4--/v1779722176/pdfs/euvwr9bjhrfacpnnxduf';
  
  try {
    const res = await axios.get(url);
    console.log('Derived URL: Success', res.status);
  } catch (err) {
    console.log('Derived URL: Failed', err.response?.status, err.response?.statusText);
    if (err.response?.headers) {
      console.log('Headers:', err.response.headers);
    }
  }
}

main().catch(console.error);
