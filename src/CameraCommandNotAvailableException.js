'use strict'

const { CameraServerException } = require('./CameraServerException')

class CameraCommandNotAvailableException extends CameraServerException {
  constructor (command) {
    super(`Cannot find command ${command}`)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  CameraCommandNotAvailableException
}