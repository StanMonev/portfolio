const AppError = require('../errors/AppError');

function notFoundHandler(req, res, next) {
  next(new AppError('The requested page could not be found.', {
    statusCode: 404,
    code: 'NOT_FOUND',
    details: { path: req.originalUrl }
  }));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const error = normalizeError(err);
  const isProduction = process.env.NODE_ENV === 'production';
  const exposeMessage = error.expose || !isProduction;
  const message = exposeMessage ? error.message : 'An unexpected error occurred.';

  if (error.statusCode >= 500 || (!isProduction && !error.expose)) {
    console.error(`[${error.code}] ${error.message}`, {
      method: req.method,
      path: req.originalUrl,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack
    });
  }

  if (isApiRequest(req)) {
    res.status(error.statusCode).json({
      msg: message,
      data: buildApiErrorData(error, exposeMessage)
    });
    return;
  }

  res.status(error.statusCode).render('error', {
    statusCode: error.statusCode,
    code: error.code,
    message,
    showDetails: !isProduction,
    details: error.details,
    stack: !isProduction ? error.stack : null
  });
}

function normalizeError(err) {
  if (err instanceof AppError) {
    return err;
  }

  return new AppError(err.message || 'An unexpected error occurred.', {
    statusCode: err.statusCode || err.status || 500,
    code: err.code || 'INTERNAL_ERROR',
    details: err.details || null,
    expose: false
  });
}

function buildApiErrorData(error, exposeMessage) {
  const data = { code: error.code };

  if (!exposeMessage || !error.details) {
    return data;
  }

  if (typeof error.details === 'object' && !Array.isArray(error.details)) {
    return {
      ...error.details,
      ...data
    };
  }

  return {
    ...data,
    details: error.details
  };
}

function isApiRequest(req) {
  if (req.originalUrl.startsWith('/api/') || req.originalUrl === '/api') return true;
  if (req.xhr) return true;

  const accept = req.get('accept') || '';
  return accept.includes('application/json') && !accept.includes('text/html');
}

module.exports = {
  buildApiErrorData,
  errorHandler,
  notFoundHandler
};
