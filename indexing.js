// indexing.js - MongoDB indexing for performance optimization

const { MongoClient } = require('mongodb');

// Connection configuration
const uri = 'mongodb://127.0.0.1:27017/?directConnection=true';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function createIndexes() {
  let client;
  
  try {
    // Create a new MongoClient
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });

    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to MongoDB server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Create index on title field
    console.log('\nCreating index on title field...');
    await collection.createIndex({ title: 1 });
    console.log('Index created on title field');

    // 2. Create compound index on author and published_year
    console.log('\nCreating compound index on author and published_year...');
    await collection.createIndex({ author: 1, published_year: 1 });
    console.log('Compound index created on author and published_year');

    // 3. Demonstrate performance improvement with explain()
    console.log('\nTesting performance with explain():');

    // Without index
    console.log('\nQuery without index:');
    const withoutIndex = await collection.find({ title: '1984' })
      .explain('executionStats');
    console.log(`Execution time: ${withoutIndex.executionStats.executionTimeMillis}ms`);
    console.log(`Documents examined: ${withoutIndex.executionStats.totalDocsExamined}`);

    // With index
    console.log('\nQuery with index:');
    const withIndex = await collection.find({ title: '1984' })
      .hint({ title: 1 })
      .explain('executionStats');
    console.log(`Execution time: ${withIndex.executionStats.executionTimeMillis}ms`);
    console.log(`Documents examined: ${withIndex.executionStats.totalDocsExamined}`);

    // Compound index example
    console.log('\nTesting compound index:');
    const compoundQuery = await collection.find({
      author: 'J.R.R. Tolkien',
      published_year: { $gt: 1940 }
    }).explain('executionStats');
    console.log(`Execution time: ${compoundQuery.executionStats.executionTimeMillis}ms`);
    console.log(`Documents examined: ${compoundQuery.executionStats.totalDocsExamined}`);

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('Connection closed');
    }
  }
}

// Run the function
createIndexes().catch(console.error);