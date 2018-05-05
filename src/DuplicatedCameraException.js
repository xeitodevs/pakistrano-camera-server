'use strict'

const { CameraServerException } = require('./CameraServerException')

class DuplicatedCameraException extends CameraServerException {
  constructor (name) {
    super(`Camera name ${name} is duplicated`)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  DuplicatedCameraException
}