/**
 * pagesController.js
 *
 * This file contains controller functions responsible for rendering various pages
 * of the application and handling specific form submissions, such as the contact form.
 * It also includes utility functions for sending responses in JSON format.
 *
 * Key functionalities:
 * - Render static pages, including the home page, admin page, and policy content pages.
 * - Handle form submissions for sending emails using a service.
 * - Provide debugging information based on the environment.
 *
 * This controller is central to serving the static content and handling some
 * dynamic actions like sending emails, ensuring the smooth operation of the application's front-end.
 */

const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const path = require('path');
const skills = [
  { name: 'JavaScript', icon: '/assets/images/icons/skills/javascript.webp' },
  { name: 'CSS', icon: '/assets/images/icons/skills/css3.webp' },
  { name: 'HTML5', icon: '/assets/images/icons/skills/html5.webp' },
  { name: 'Java', icon: '/assets/images/icons/skills/java.webp' },
  { name: 'Python', icon: '/assets/images/icons/skills/python.webp' },
  { name: 'Ruby', icon: '/assets/images/icons/skills/ruby.webp' },
  { name: 'PHP', icon: '/assets/images/icons/skills/php.webp' },
  { name: 'C#', icon: '/assets/images/icons/skills/csharp.webp' },
  { name: 'R', icon: '/assets/images/icons/skills/r.webp' },
  { name: 'TypeScript', icon: '/assets/images/icons/skills/typescript.webp' },
  { name: 'C++', icon: '/assets/images/icons/skills/cplusplus.webp' },
  { name: 'Haskell', icon: '/assets/images/icons/skills/haskell.webp' },
  { name: 'Ruby on Rails', icon: '/assets/images/icons/skills/rubyonrails.webp' },
  { name: 'ExpressJS', icon: '/assets/images/icons/skills/expressjs.webp' },
  { name: 'Laravel', icon: '/assets/images/icons/skills/laravel.webp' },
  { name: 'FastAPI', icon: '/assets/images/icons/skills/fastapi.webp' },
  { name: 'Angular', icon: '/assets/images/icons/skills/angular.webp' },
  { name: 'Django', icon: '/assets/images/icons/skills/django.webp' },
  { name: 'NodeJS', icon: '/assets/images/icons/skills/nodejs.webp' },
  { name: 'JSON', icon: '/assets/images/icons/skills/json.webp' },
  { name: 'XML', icon: '/assets/images/icons/skills/xml.webp' },
  { name: 'JQuery', icon: '/assets/images/icons/skills/jquery.webp' },
  { name: 'jQWidgets', icon: '/assets/images/icons/skills/jqwidgets.webp' },
  { name: 'BrainJS', icon: '/assets/images/icons/skills/brainjs.webp' },
  { name: 'PyTorch', icon: '/assets/images/icons/skills/pytorch.webp' },
  { name: 'TensorFlow', icon: '/assets/images/icons/skills/tensorflow.webp' },
  { name: 'Numpy', icon: '/assets/images/icons/skills/numpy.webp' },
  { name: 'Pandas', icon: '/assets/images/icons/skills/pandas.webp' },
  { name: 'Matplotlib', icon: '/assets/images/icons/skills/matplotlib.webp' },
  { name: 'RSpec', icon: '/assets/images/icons/skills/rspec.webp' },
  { name: 'JUnit 5', icon: '/assets/images/icons/skills/junit.webp' },
  { name: 'Postman', icon: '/assets/images/icons/skills/postman.webp' },
  { name: 'Unity', icon: '/assets/images/icons/skills/unity.webp' },
  { name: 'Shopify', icon: '/assets/images/icons/skills/shopify.webp' },
  { name: 'Git', icon: '/assets/images/icons/skills/git.webp' },
  { name: 'Github', icon: '/assets/images/icons/skills/github.webp' },
  { name: 'Gitlab', icon: '/assets/images/icons/skills/gitlab.webp' },
  { name: 'SQL', icon: '/assets/images/icons/skills/sql.webp' },
  { name: 'MySQL', icon: '/assets/images/icons/skills/mysql.webp' },
  { name: 'PostgreSQL', icon: '/assets/images/icons/skills/postgresql.webp' },
  { name: 'MongoDB', icon: '/assets/images/icons/skills/mongodb.webp' },
  { name: 'MariaDB', icon: '/assets/images/icons/skills/mariadb.webp' }
];



/**
 * Handles the submission of the contact form and sends an email using the email service.
 * 
 * @param {Object} req - The request object containing form data such as name, email, subject, and message.
 * @param {Object} res - The response object used to send the result of the email operation.
 * @returns {Promise<void>} - Sends a JSON response indicating success or any validation errors.
 */

const sendEmailFunction = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).send(_getJSON('Some form elements are not full.', errors.mapped()));
  } else {
    const mailOptions = {
      templatePath: path.join(__dirname, '..', 'views', 'partials', 'emailForm.ejs'),
      templateData: {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        text: req.body.message
      },
      fromEmail: process.env.FROM_EMAIL,
      toEmail: process.env.TO_EMAIL,
      subject: req.body.subject,
      text: req.body.message
    };

    try {
      await emailService.setupMailer(mailOptions);
      res.status(200).send(_getJSON("E-Mail sent successfully!"));
    } catch (error) {
      res.status(500).send(_getJSON(error.message));
    }
  }
};

/**
 * Handles the GET method for all the images in the public directory.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the images.
 * @returns {Promise<void>} - Sends a JSON response that includes the images.
 */

const getImages = async (req, res) => {
  const mainImages = _getImagePaths('public/assets/images');
  const iconImages = _getImagePaths('public/assets/images/icons');
  
  const allImages = [...mainImages, ...iconImages];
  res.json(allImages);
}

// //////////////////////
// GET Components
// //////////////////////


const getDownloadButton = async (req, res) => {
  res.render('partials/downloadButton', {id:'downloadButton', css:'download-button', text:'DOWNLOAD RESUME'});
}


// //////////////////////
// Page Rendering Logic
// //////////////////////

const getHomePage = (req, res) => {
  res.render('index', {skills});
};

const getAdminPage = (req, res) => {
  res.render('admin');
};

/**
 * Renders the legacy resume editor page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @deprecated Legacy resume/CV implementation.
 */
const getResumeEditorPage = (req, res) => {
  res.render('resume_editor');
};

const getTACPolicyContent = (req, res) => {
  res.render('partials/tacPolicy');
};

const getPrivacyPolicyContent = (req, res) => {
  res.render('partials/privacyPolicy');
};

const getCookiePolicyContent = (req, res) => {
  res.render('partials/cookiePolicy');
};

const getCopyrightContent = (req, res) => {
  res.render('partials/copyright');
};

const getDebugMode = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ 'debug': process.env.NODE_ENV !== 'production' }));
};

const getEmailForm = (req, res) => {
  res.render('partials/emailForm');
};

// ///////////////////
// Private functions
// ///////////////////

function _getJSON(message = '', data = null) {
  return JSON.stringify({
    msg: message,
    data: data
  });
}

function _getImagePaths(dir) {
  const fs = require('fs');
  const path = require('path');
  return fs.readdirSync(dir)
    .filter(file => /\.(jpg|jpeg|png|gif|svg)$/.test(file)) // Filters for image files only
    .map(file => path.join(dir.replace('public/', ''), file)); // Adjust path for public access
}

// ///////
// Export
// ///////

module.exports = {
  getHomePage,
  getAdminPage,
  getResumeEditorPage,
  getDebugMode,
  getEmailForm,
  sendEmailFunction,
  getTACPolicyContent,
  getPrivacyPolicyContent,
  getCookiePolicyContent,
  getCopyrightContent,
  getImages,
  getDownloadButton
};
