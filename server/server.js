require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  cache: "bounded"
});

const startApolloServer = async () => {

  await server.start();

  server.applyMiddleware({ app });

  db.once('open', () => {

    app.listen(PORT, () => {

      console.log(`✅ MongoDB connected`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`GraphQL ready at /graphql`);

    });

  });

};

startApolloServer();
