'use strict'

const config = require('./config')
const app = require('./app')
const { CameraRegistry } = require('./src/CameraRegistry')
const { CameraSwitcher } = require('./src/CameraSwitcher')
const { retrieveCamera } = require('./src/cameraRepository')
const { getCameraDriver } = require('./src/cameraFactory')

const cameraRegistry = new CameraRegistry()

const cameraSwitcher = new CameraSwitcher(cameraRegistry, retrieveCamera, getCameraDriver)
app.services = {
  cameraSwitcher
}
app.listen(config.port, () => {
  console.log(`Pakistrano camera server is running at ${config.port}`)
})

