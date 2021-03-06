'use strict'

const { CameraServerException } = require('./CameraServerException')

class CameraNotFoundException extends CameraServerException {
  constructor (name) {
    super(`Cannot find camera ${name}`)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  CameraNotFoundException
}