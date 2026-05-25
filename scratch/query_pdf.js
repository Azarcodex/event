const mongoose = require('mongoose');
const mongoUrl = "mongodb+srv://greenhopperevent_db_user:cMVATouqzKN4mqP3@cluster0.kprdgkl.mongodb.net/event?appName=Cluster0";

async function main() {
  await mongoose.connect(mongoUrl);
  console.log('Connected to DB');
  
  const db = mongoose.connection.db;
  const collection = db.collection('shareddocuments');
  const documents = await collection.find({}).toArray();
  
  console.log('All documents in shareddocuments collection:');
  console.dir(documents, { depth: null });
  
  await mongoose.disconnect();
}

main().catch(console.error);
