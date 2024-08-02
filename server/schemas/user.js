const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
    bookCount: Int
  }

  extend type Query {
    getUserById(id: ID!): User
    getUserByUsername(username: String!): User
  }

  extend type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    saveBook(bookInput: BookInput!): User
    deleteBook(bookId: String!): User
  }

  type Auth {
    token: String
    user: User
  }

  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
`;

module.exports = userTypeDefs;
