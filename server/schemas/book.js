const { gql } = require('apollo-server-express');

const bookTypeDefs = gql`
  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
`;

module.exports = bookTypeDefs;
