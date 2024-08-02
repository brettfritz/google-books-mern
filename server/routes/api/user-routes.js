const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// Routes for user operations
router
  .route('/')
  .post(createUser) // Create a new user
  .put(authMiddleware, saveBook); // Save a book (requires authentication)

// Route for user login
router.route('/login').post(login);

// Route to get the current user (requires authentication)
router.route('/me').get(authMiddleware, getSingleUser);

// Route to delete a book from saved books (requires authentication)
router.route('/books/:bookId').delete(authMiddleware, deleteBook);

module.exports = router;
