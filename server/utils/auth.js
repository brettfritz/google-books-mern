const jwt = require('jsonwebtoken');

// Set token secret and expiration date
const secret = process.env.JWT_SECRET || 'mysecretsshhhhh';
const expiration = '2h';

// Function to verify and decode the token
const verifyToken = (token) => {
  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    return data;
  } catch (err) {
    console.log('Invalid token:', err);
    return null;
  }
};

// Function to create a token
const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

// Middleware function to attach user to the context
const context = ({ req }) => {
  // Extract token from headers
  const token = req.headers.authorization || '';
  const user = token ? verifyToken(token.split(' ').pop().trim()) : null;

  return { user };
};

module.exports = { signToken, context };
