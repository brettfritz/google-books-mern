const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const routes = require('./routes');
const { context } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,  // Use the context function for authentication
});

async function startApolloServer() {
  // Start the Apollo Server
  await server.start();

  // Apply middleware to the /graphql endpoint
  app.use('/graphql', expressMiddleware(server, {
    context: ({ req }) => context({ req }),  // Use context function to handle authentication
  }));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Serve client build as static assets if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Apply other routes
  app.use(routes);

  // Connect to the database and start the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();
