'use strict'

const config = require('./config')
const app = require('./app')

app.listen(config.port, () => {
  console.log(`Pakistrano camera server is running at ${config.port}`)
})