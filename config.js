const path = require('path')
const varDataDir = path.resolve(__dirname, './var')

module.exports = {
  environment: process.env.NODE_ENV || 'production',
  authToken: process.env.AUTH_TOKEN || 'auth_token',
  sslEnabled: process.env.ENABLE_SSL || false,
  sslCertPath: path.join(varDataDir, 'server.cert'),
  sslKeyPath: path.join(varDataDir, 'server.key'),
  port: process.env.PORT || 3000,
  database: process.env.DATABASE_PATH || path.join(varDataDir, 'database.sqlite')
}