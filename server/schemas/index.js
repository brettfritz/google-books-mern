const { gql } = require('apollo-server-express');
const userResolvers = require('./user-resolvers');
const bookResolvers = require('./book-resolvers');

// Define your type definitions
const typeDefs = gql`
  # Define the types used in your schema here

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: String
    user: User
  }

  type Query {
    me: User
    user(username: String!): User
  }

  type Mutation {
    login(username: String!, email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String], description: String!, bookId: String!, image: String, link: String, title: String!): User
    removeBook(bookId: String!): User
  }
`;

// Combine all resolvers
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      return context.user ? await User.findById(context.user._id) : null;
    },
    user: async (parent, { username }) => {
      return User.findOne({ username });
    },
  },
  Mutation: {
    login: async (parent, { username, email, password }) => {
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await user.isCorrectPassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { authors, description, bookId, image, link, title }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: { authors, description, bookId, image, link, title } } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      return updatedUser;
    },
  },
};

// Export typeDefs and resolvers
module.exports = { typeDefs, resolvers };
