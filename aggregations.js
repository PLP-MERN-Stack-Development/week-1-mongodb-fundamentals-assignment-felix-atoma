// aggregations.js - MongoDB aggregation pipelines for PLP Bookstore assignment

const { MongoClient } = require('mongodb');

// Connection configuration
const uri = 'mongodb://127.0.0.1:27017/?directConnection=true';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runAggregations() {
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

    // 1. Calculate average price by genre
    console.log('\n1. Average price by genre:');
    const avgPriceByGenre = await collection.aggregate([
      {
        $group: {
          _id: '$genre',
          averagePrice: { $avg: '$price' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]).toArray();
    console.table(avgPriceByGenre.map(g => ({
      Genre: g._id,
      'Average Price': g.averagePrice.toFixed(2),
      'Book Count': g.count
    })));

    // 2. Find author with most books
    console.log('\n2. Author with most books:');
    const prolificAuthor = await collection.aggregate([
      {
        $group: {
          _id: '$author',
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { bookCount: -1 }
      },
      {
        $limit: 1
      }
    ]).toArray();
    console.table(prolificAuthor.map(a => ({
      Author: a._id,
      'Book Count': a.bookCount
    })));

    // 3. Group books by publication decade and count them
    console.log('\n3. Books by publication decade:');
    const booksByDecade = await collection.aggregate([
      {
        $project: {
          decade: {
            $subtract: [
              '$published_year',
              { $mod: ['$published_year', 10] }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$decade',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
    console.table(booksByDecade.map(d => ({
      Decade: `${d._id}s`,
      'Book Count': d.count
    })));

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
runAggregations().catch(console.error);