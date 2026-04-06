/**
 * server.js
 *
 * This file serves as the entry point for the Resume Website Application.
 * It is responsible for setting up the server, configuring middleware,
 * managing sessions, handling authentication, and routing requests to
 * the appropriate route handlers.
 *
 * Key functionalities:
 * - Load environment variables from a .env file in non-production environments.
 * - Initialize the Express application and configure it with middleware such as
 *   body-parser, session management, Passport.js for authentication, and flash messages.
 * - Set up the EJS view engine for rendering HTML views.
 * - Serve static files from the "public" directory.
 * - Conditionally trust the first proxy in production environments.
 * - Import and use route handlers defined in the routes/index.js file.
 * - Start the server and listen on the port specified in the environment variables.
 *
 * This file is essential for the overall operation of the application, 
 * acting as the central hub where all initial configurations and setups are performed.
 */


// /////////////////////////////////////////////////////////////
// Initializing neccesary constants for the application to run.
// /////////////////////////////////////////////////////////////


// .env file should only be used in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const pagesRouter = require("./routes/index");
const app = express();
const minifiedJavaScriptDir = path.join(__dirname, 'public', 'assets', 'javascript', 'dist');

// /////////////////////////////
// General server logic
// /////////////////////////////

app.set('view engine', 'ejs');

app.locals.jsAsset = filename => {
  if (process.env.NODE_ENV !== 'production') {
    return `/assets/javascript/${filename}`;
  }

  const minifiedFilename = filename.replace(/\.js$/, '.min.js');
  const minifiedFilePath = path.join(minifiedJavaScriptDir, minifiedFilename);

  if (fs.existsSync(minifiedFilePath)) {
    return `/assets/javascript/dist/${minifiedFilename}`;
  }

  return `/assets/javascript/${filename}`;
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());


// "trust proxy" must be true, so that the website will be trusted in production and the cookies logic will work without errors
if(process.env.NODE_ENV === 'production') app.set('trust proxy', true);

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(pagesRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
