/**
 * authController.js
 *
 * This file contains controller functions for managing user authentication,
 * including handling user login and managing logout.
 *
 * Key functionalities:
 * - Handle user login, including session management and "remember me" functionality.
 * - Manage user logout by destroying the session and redirecting to the login page.
 *
 * This controller acts as an intermediary between the routes and the authentication service,
 * ensuring that authentication logic is handled consistently across the application.
 */

const authService = require('../services/authService');

/**
 * Handles user login by authenticating the user and setting up the session.
 * 
 * @param {Object} req - The request object, containing the username, password, and rememberMe option.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Redirects to the admin page if successful, otherwise redirects back to the login page with an error message.
 */

const loginUser = async (req, res) => {
  const { username, password, rememberMe } = req.body;
  const user = await authService.authenticateUser(username, password);
  if (user) {
    req.session.userId = user.id;
    if (rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.expires = false;
    }
    res.redirect('/admin');
  } else {
    console.log('Authentication failed');
    req.flash('error', 'Invalid username or password');
    res.redirect('/login');
  }
};

/**
 * Logs the user out by destroying the session and redirecting to the login page.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} - Redirects to the login page after destroying the session.
 */

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
};

// ///////
// Export
// ///////

module.exports = {
  loginUser,
  logoutUser
};
