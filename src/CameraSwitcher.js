class CameraSwitcher {

  constructor (cameraRegistry, cameraRetrieve) {
    this._cameraRegistry = cameraRegistry
    this._cameraRetrieve = cameraRetrieve
  }

  async perform (cameraName) {
    let camera
    camera = this._cameraRegistry.findCamera(cameraName)
    if (camera) {
      return camera
    }
    camera = await this._cameraRetrieve(cameraName)
    this._cameraRegistry.addCamera(camera)
    return camera
  }
}

module.exports = {
  CameraSwitcher
}