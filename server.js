const { getEnv, loadEnv } = require('./config/env');

loadEnv();

const app = require('./app');
const env = getEnv();

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
