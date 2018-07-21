'use strict'

const config = require('./config')
const fs = require('fs')
const { getAppInstance } = require('./appFactory')
const app = getAppInstance()

if (!module.parent) {
  let httpServer
  if (config.sslEnabled && config.environment === 'production') {
    httpServer = require('https')
    const key = fs.readFileSync(config.sslKeyPath)
    const cert = fs.readFileSync(config.sslCertPath)
    httpServer.createServer({ key, cert }, app).listen(config.port, startedMessage.bind(null, config.port))
  } else {
    httpServer = require('http')
    httpServer.createServer(app).listen(config.port, startedMessage.bind(null, config.port))
  }
}

function startedMessage (port) {
  console.log(`Pakistrano camera server is running at ${port}`)
}
