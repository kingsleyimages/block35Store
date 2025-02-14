const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(require('morgan')('dev'));
app.use(express.json());
const {
  client,
  fetchUsers,
  createUser,
  fetchProducts,
  createFavorite,
  fetchFavoritesById,
  deleteFavorite,
} = require('./db');

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});
app.get('/api/products', async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});
app.post('/api/users', async (req, res, next) => {
  try {
    const user = await createUser(req.body.username, req.body.password);
    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
});

app.post('/api/user/:userId/product/:productId', async (req, res, next) => {
  try {
    const newFavorite = await createFavorite(
      req.params.userId,
      req.params.productId
    );
    res.status(201).send(newFavorite);
  } catch (error) {
    next(error);
  }
});

app.get('/api/favorites/:id', async (req, res, next) => {
  try {
    const favorites = await fetchFavoritesById(req.params.id);
    res.send(favorites);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/user/:userId/product/:productId', async (req, res, next) => {
  try {
    const favorite = await deleteFavorite(
      req.params.userId,
      req.params.productId
    );
    res.status(204).send(favorite);
  } catch (error) {
    next(error);
  }
});
const init = async () => {
  try {
    await client.connect();
    app.listen(3001, () => {
      console.log('Server is listening on port 3001');
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
};
init();
