require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const path = require('path');
const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    /\.vercel\.app$/,
  ],
  credentials: true,
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let serverStarted = false;

const getApp = async () => {
  if (!serverStarted) {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware,
    });
    await server.start();
    server.applyMiddleware({ app });
    serverStarted = true;

    await new Promise((resolve) => {
      if (db.readyState === 1) return resolve();
      db.once('open', resolve);
    });
  }
  return app;
};

// ✅ Render + local dev — hamesha listen karo
const PORT = process.env.PORT || 3001;
getApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
  });
});

// ✅ Vercel export
module.exports = async (req, res) => {
  const appInstance = await getApp();
  appInstance(req, res);
};
