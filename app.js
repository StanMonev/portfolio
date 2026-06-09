const compression = require('compression');
const connectPgSimple = require('connect-pg-simple');
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { getEnv, loadEnv } = require('./config/env');

loadEnv();
const env = getEnv();
const app = express();
const minifiedJavaScriptDir = path.join(__dirname, 'public', 'assets', 'javascript', 'dist');

app.disable('x-powered-by');
app.set('view engine', 'ejs');

if (env.isProduction) {
  app.set('trust proxy', 1);
}

app.locals.jsAsset = filename => {
  if (!env.isProduction) {
    return `/assets/javascript/${filename}`;
  }

  const minifiedFilename = filename.replace(/\.js$/, '.min.js');
  const minifiedFilePath = path.join(minifiedJavaScriptDir, minifiedFilename);

  if (fs.existsSync(minifiedFilePath)) {
    return `/assets/javascript/dist/${minifiedFilename}`;
  }

  return `/assets/javascript/${filename}`;
};

app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));
app.use(compression({ threshold: 0 }));
app.use(securityHeaders);
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: env.isProduction ? '7d' : 0
}));
app.use(session(getSessionOptions()));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

function securityHeaders(req, res, next) {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (env.isProduction && req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
}

function getSessionOptions() {
  const options = {
    name: 'smworks.sid',
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  };

  if (env.isProduction && env.databaseUrl) {
    const PgSessionStore = connectPgSimple(session);
    options.store = new PgSessionStore({
      conString: env.databaseUrl,
      createTableIfMissing: true
    });
  }

  return options;
}

module.exports = app;
