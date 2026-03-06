module.exports = {
  development: {
    type: 'development',
    port: 3000,
    mongodb: 'mongodb://localhost:27017/cyberdb',
    jwtSecret: 'TheS@crEtKey!'
  },
  production: {
    type: 'production',
    port: 3000,
    mongodb: 'mongodb://localhost:27017/cyberdb',
    jwtSecret: 'TheS@crEtKey!'
  }
};