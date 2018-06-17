const app = require('./app')
const { CameraRegistry } = require('./src/CameraRegistry')
const { CameraSwitcher } = require('./src/CameraSwitcher')
const { retrieveCamera } = require('./src/cameraRepository')
const { getCameraDriver } = require('./src/cameraFactory')

function getAppInstance (withCameraDriver = getCameraDriver) {

  const cameraRegistry = new CameraRegistry()
  const cameraSwitcher = new CameraSwitcher(cameraRegistry, retrieveCamera, withCameraDriver)
  app.services = {
    cameraSwitcher
  }
  return app
}

module.exports = {
  getAppInstance
}
