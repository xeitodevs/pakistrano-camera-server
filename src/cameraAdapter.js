const config = require('../config')

const PakistranoCameraControl = require('pakistrano-camera-control')
const camera = new PakistranoCameraControl({
  host: config.cameraHost,
  user: config.cameraUser,
  password: config.cameraPassword
})

module.exports = camera