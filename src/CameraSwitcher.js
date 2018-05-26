const { CameraNotFoundException } = require('./CameraNotFoundException')

class CameraSwitcher {

  constructor (cameraRegistry, cameraRetrieve, cameraDriverFactory) {
    this._cameraRegistry = cameraRegistry
    this._cameraRetrieve = cameraRetrieve
    this._cameraDriverFactory = cameraDriverFactory
  }

  async perform (cameraName) {
    let camera
    try {
      camera = this._cameraRegistry.findCamera(cameraName)
    } catch (err) {
      if (err instanceof CameraNotFoundException) {
        camera = await this._cameraRetrieve(cameraName)
        this._cameraRegistry.addCamera(camera)
      } else {
        throw err
      }
    }
    return this._cameraDriverFactory(camera)
  }
}

module.exports = {
  CameraSwitcher
}