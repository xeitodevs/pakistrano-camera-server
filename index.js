'use strict'

const config = require('./config')
const { getAppInstance } = require('./appFactory')

if (!module.parent) {
  getAppInstance().listen(config.port, () => {
    console.log(`Pakistrano camera server is running at ${config.port}`)
  })
}

