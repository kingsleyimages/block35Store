const pg = require('pg');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const client = new pg.Client();

const createTables = async () => {
  try {
    const SQL = `
      DROP TABLE IF EXISTS favorites;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id UUID PRIMARY KEY,
        username VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(256) NOT NULL);

      CREATE TABLE products (
        id UUID PRIMARY KEY,
        name VARCHAR(128) UNIQUE NOT NULL);

      CREATE TABLE favorites (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES products(id) NOT NULL,
        CONSTRAINT user_product_favorite UNIQUE (product_id, user_id));
        `;
    await client.query(SQL);
  } catch (error) {
    console.log(error);
  }
};

const createUser = async (username, password) => {
  try {
    const SQL = `
      INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *; `;
    const { rows } = await client.query(SQL, [
      uuid.v4(),
      username,
      await bcrypt.hash(password, 5),
    ]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const fetchUsers = async () => {
  try {
    const SQL = `SELECT id, username FROM users; `;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const createProduct = async (name) => {
  try {
    const SQL = `
      INSERT INTO products(id, name) VALUES($1, $2) RETURNING *; `;
    const { rows } = await client.query(SQL, [uuid.v4(), name]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const fetchProducts = async () => {
  try {
    const SQL = `SELECT name FROM products; `;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const createFavorite = async (userId, productId) => {
  try {
    const SQL = `
      INSERT INTO favorites (id, user_id, product_id) VALUES($1, $2, $3) RETURNING *; `;
    const { rows } = await client.query(SQL, [uuid.v4(), userId, productId]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const fetchFavoritesById = async (id) => {
  try {
    const SQL = `SELECT a.name FROM products a INNER JOIN favorites b ON a.id=b.product_id WHERE b.user_id=$1`;
    const { rows } = await client.query(SQL, [id]);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

const deleteFavorite = async (userId, productId) => {
  try {
    const SQL = `
      DELETE FROM favorites WHERE user_id=$1 AND product_id=$2; `;
    await client.query(SQL, [userId, productId]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  createProduct,
  fetchProducts,
  createFavorite,
  fetchFavoritesById,
  deleteFavorite,
};
