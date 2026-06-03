/**
 * index.js (Routes)
 *
 * This file defines the routes for the application, including handling requests for static pages,
 * user authentication, resume management, cookie preferences, and analytics tracking.
 * It acts as a central routing mechanism that delegates requests to the appropriate controllers.
 *
 * Routes Overview:
 * - Main Pages: Serves static pages like the homepage, terms and conditions, privacy policy, etc.
 * - Admin Pages: Routes that require authentication, such as the admin dashboard and resume editor.
 * - Resume API: Handles CRUD operations for resumes, work experiences, education, and projects.
 * - Cookie and Analytics API: Manages user cookie preferences and tracks analytics data.
 * - Authentication: Manages user login and logout functionality.
 * - Debugging and Testing: Provides routes for debugging and testing purposes.
 */

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authController = require('../controllers/authController');
const pagesController = require('../controllers/pagesController');
const resumeController = require('../controllers/resumeController');
const cookieController = require('../controllers/cookieController');

// Validation middleware for contact form
const sendEmailErrors = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid Email Address'),
  check('subject').notEmpty().withMessage('Subject is required'),
  check('message').notEmpty().withMessage('Message is required'),
  check('recaptchaToken').notEmpty().withMessage('Security check is required')
];

const recaptchaTokenErrors = [
  check('recaptchaToken').notEmpty().withMessage('Security check is required')
];

///////////////////// MAIN ROUTES //////////////////////////

/**
 * Main routes for serving static pages.
 */
router.get('/', pagesController.getHomePage);
router.get('/tac-policy-content', pagesController.getTACPolicyContent);
router.get('/privacy-policy-content', pagesController.getPrivacyPolicyContent);
router.get('/cookie-policy-content', pagesController.getCookiePolicyContent);
router.get('/copyright-content', pagesController.getCopyrightContent);

/**
 * Admin routes requiring authentication.
 */
router.get('/admin', authController.ensureAuthenticated, pagesController.getAdminPage);
router.get('/admin/resume_editor', authController.ensureAuthenticated, pagesController.getResumeEditorPage);

/**
 * Route for handling contact form submissions with validation.
 */
router.post('/contact', sendEmailErrors, pagesController.sendEmailFunction);
router.post('/api/resume-download/verify', recaptchaTokenErrors, pagesController.verifyResumeDownloadFunction);

/**
 * Route for handling the image loading.
 */
router.get('/api/images', pagesController.getImages);
router.get('/api/download-button', pagesController.getDownloadButton);

///////////////////// RESUME ROUTES //////////////////////////

/**
 * API routes for managing resumes, work experiences, education, and projects.
 * @deprecated Legacy resume/CV API endpoints.
 */
router.post('/api/resume/save', resumeController.saveOrUpdateResume);
router.get('/api/resume', resumeController.getResumeInfo);
router.post('/api/resume/work-experience', resumeController.addOrUpdateWorkExperience);
router.delete('/api/resume/work-experience', resumeController.deleteWorkExperience);
router.get('/api/resume/work-experience/:id', resumeController.getWorkExperience);
router.post('/api/resume/education', resumeController.addOrUpdateEducation);
router.delete('/api/resume/education', resumeController.deleteEducation);
router.get('/api/resume/education/:id', resumeController.getEducation);
router.post('/api/resume/project', resumeController.addOrUpdateProject);
router.delete('/api/resume/project', resumeController.deleteProject);
router.get('/api/resume/project/:id', resumeController.getProject);
router.get('/api/resume/projects', resumeController.getProjects);
router.get('/api/resume/educations', resumeController.getEducations);
router.get('/api/resume/work-experiences', resumeController.getWorkExperiences);
router.get('/api/resume/projects-admin', resumeController.getAdminProjects);
router.get('/api/resume/educations-admin', resumeController.getAdminEducations);
router.get('/api/resume/work-experiences-admin', resumeController.getAdminWorkExperiences);
router.get('/api/resume/admin', resumeController.getAdminResume);

///////////////////// COOKIE AND ANALYTICS ROUTES //////////////////////////

/**
 * API routes for tracking analytics and managing cookie preferences.
 */
router.post('/api/track', cookieController.trackAnalytics);
router.post('/api/set-preference', cookieController.setCookiePreference);
router.get('/api/analytics', cookieController.getAnalyticsData);

///////////////////// AUTHENTICATION ROUTES //////////////////////////

/**
 * Routes for user login, logout, and rendering the login page.
 */
router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

///////////////////// TESTING ROUTES //////////////////////////

/**
 * Debugging and testing routes.
 */
router.get('/debug', pagesController.getDebugMode);
router.get('/emailform', pagesController.getEmailForm);


///////////////////// EXPORT //////////////////////////

module.exports = router;
