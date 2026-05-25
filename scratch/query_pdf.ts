import mongoose from 'mongoose';
import dbConnect from '../src/lib/mongodb';
import SharedDocument from '../src/models/SharedDocument';

async function main() {
  await dbConnect();
  console.log('Connected to DB');
  
  const allPdfs = await SharedDocument.find();
  console.log('All PDFs in DB:');
  console.log(allPdfs.map(p => ({ id: p._id.toString(), title: p.title, isEnabled: p.isEnabled })));
  
  mongoose.connection.close();
}

main().catch(console.error);
