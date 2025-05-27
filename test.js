// test.js
const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/?directConnection=true';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected successfully');
    const db = client.db('test');
    console.log(await db.command({ ping: 1 }));
  } finally {
    await client.close();
  }
}

run().catch(console.dir);