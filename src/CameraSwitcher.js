class CameraSwitcher {

  constructor (cameraRegistry, cameraRetrieve, cameraDriverFactory) {
    this._cameraRegistry = cameraRegistry
    this._cameraRetrieve = cameraRetrieve
    this._cameraDriverFactory = cameraDriverFactory
  }

  async perform (cameraName) {
    let camera
    camera = this._cameraRegistry.findCamera(cameraName)
    if (!camera) {
      camera = await this._cameraRetrieve(cameraName)
      this._cameraRegistry.addCamera(camera)
    }
    return this._cameraDriverFactory(camera)
  }
}

module.exports = {
  CameraSwitcher
}