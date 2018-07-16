const path = require('path')

module.exports = {
  environment: process.env.NODE_ENV || 'production',
  authToken: process.env.AUTH_TOKEN || 'auth_token',
  port: process.env.PORT || 3000,
  database: process.env.DATABASE_PATH || path.resolve(__dirname, './var/database.sqlite')
}