'use strict'

const { CameraServerException } = require('./CameraServerException')

class AuthException extends CameraServerException {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  AuthException
}