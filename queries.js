// queries.js - MongoDB queries for PLP Bookstore assignment

// Connect to MongoDB
const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
const client = new MongoClient(uri);
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  try {
    await client.connect();
    console.log('Connected to MongoDB server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Find all books in a specific genre
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log('\nFiction books:');
    console.log(fictionBooks);

    // 2. Find books published after a certain year
    const recentBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log('\nBooks published after 1950:');
    console.log(recentBooks);

    // 3. Find books by a specific author
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    console.log('\nBooks by George Orwell:');
    console.log(orwellBooks);

    // 4. Update the price of a specific book
    const updateResult = await collection.updateOne(
      { title: 'The Great Gatsby' },
      { $set: { price: 11.99 } }
    );
    console.log('\nUpdated The Great Gatsby price:');
    console.log(updateResult);

    // Verify the update
    const updatedBook = await collection.findOne({ title: 'The Great Gatsby' });
    console.log('\nUpdated book details:');
    console.log(updatedBook);

    // 5. Delete a book by its title
    const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
    console.log('\nDeleted Moby Dick:');
    console.log(deleteResult);

    // Verify the deletion
    const remainingBooks = await collection.countDocuments();
    console.log(`\nTotal books remaining: ${remainingBooks}`);

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

runQueries().catch(console.error);