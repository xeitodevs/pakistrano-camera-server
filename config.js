const path = require('path')

module.exports = {
  port: process.env.PORT || 3000,
  database: process.env.DATABASE_PATH || path.resolve(__dirname, './var/database.sqlite')
}