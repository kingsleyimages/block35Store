require('dotenv').config();
const { client, createTables, createUser, createProduct } = require('./db');

const seed = async () => {
  try {
    await client.connect();
    console.log('creating tables');
    await createTables();
    console.log('tables created');

    console.log('create users');
    const [kingsley, hamrick, hinton, stephenson, orwell, atwood] =
      await Promise.all([
        createUser('kingsley', 'password123'),
        createUser('hamrick', 'sql123'),
        createUser('hinton', 'outsiders'),
        createUser('stephenson', 'crytonomicon'),
        createUser('orwell', '1984'),
        createUser('atwood', 'handmaiden'),
      ]);
    console.log('users created');
    console.log('create products');
    const [books, records, flowers, rocks, trees, photographs] =
      await Promise.all([
        createProduct('books'),
        createProduct('records'),
        createProduct('flowers'),
        createProduct('rocks'),
        createProduct('trees'),
        createProduct('photographs'),
      ]);
    console.log('products created');
    console.log('create favorites');

    console.log('favorites created');
  } catch (error) {
    console.error('Error seeding data: ', error);
  } finally {
    await client.end();
  }
};

seed();
