// advanced_queries.js - MongoDB advanced queries for PLP Bookstore assignment

const { MongoClient } = require('mongodb');

// Connection URI - Update this with your MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017/?directConnection=true';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runAdvancedQueries() {
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

    // 1. Find books that are both in stock and published after 2010
    const inStockRecent = await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log('\n1. In-stock books published after 2010:');
    console.log(inStockRecent);

    // 2. Use projection to return only title, author, and price
    const projectedBooks = await collection.find(
      { genre: 'Fiction' },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log('\n2. Fiction books with projection (title, author, price only):');
    console.log(projectedBooks);

    // 3. Implement sorting by price (ascending and descending)
    const priceAsc = await collection.find()
      .sort({ price: 1 })
      .toArray();
    console.log('\n3a. Books sorted by price (ascending):');
    console.log(priceAsc.map(b => `${b.title}: $${b.price}`));

    const priceDesc = await collection.find()
      .sort({ price: -1 })
      .toArray();
    console.log('\n3b. Books sorted by price (descending):');
    console.log(priceDesc.map(b => `${b.title}: $${b.price}`));

    // 4. Implement pagination (5 books per page)
    const pageSize = 5;
    const page1 = await collection.find()
      .limit(pageSize)
      .skip(0)
      .toArray();
    console.log('\n4a. Page 1 (books 1-5):');
    console.log(page1.map(b => b.title));

    const page2 = await collection.find()
      .limit(pageSize)
      .skip(pageSize)
      .toArray();
    console.log('\n4b. Page 2 (books 6-10):');
    console.log(page2.map(b => b.title));

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
runAdvancedQueries().catch(console.error);