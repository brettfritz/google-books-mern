// src/utils/API.js

import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from './queries';
import { CREATE_USER, LOGIN_USER, SAVE_BOOK, DELETE_BOOK } from './mutations';
import client from './ApolloClient';

// Function to get user info
export const getMe = async (token) => {
  try {
    const { data } = await client.query({
      query: GET_ME,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch user data');
  }
};

// Function to create a new user
export const createUser = async (userData) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_USER,
      variables: { input: userData },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to create user');
  }
};

// Function to log in a user
export const loginUser = async (userData) => {
  try {
    const { data } = await client.mutate({
      mutation: LOGIN_USER,
      variables: { input: userData },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to log in');
  }
};

// Function to save a book
export const saveBook = async (bookData, token) => {
  try {
    const { data } = await client.mutate({
      mutation: SAVE_BOOK,
      variables: { input: bookData },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to save book');
  }
};

// Function to delete a book
export const deleteBook = async (bookId, token) => {
  try {
    const { data } = await client.mutate({
      mutation: DELETE_BOOK,
      variables: { bookId },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    return data;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to delete book');
  }
};

// Function to search Google Books
export const searchGoogleBooks = async (query) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    if (!response.ok) {
      throw new Error('Failed to fetch books from Google');
    }
    return response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Failed to search books');
  }
};
