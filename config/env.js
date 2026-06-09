function loadEnv() {
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
}

function getEnv() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    isProduction,
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    sessionSecret: requireEnv('SECRET_KEY'),
    databaseUrl: isProduction
      ? process.env.DATABASE_URL || ''
      : process.env.DEV_DATABASE_URL || process.env.DATABASE_URL || ''
  };
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

module.exports = {
  getEnv,
  loadEnv,
  requireEnv
};
