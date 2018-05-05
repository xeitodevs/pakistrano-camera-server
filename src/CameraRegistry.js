'use strict'

const { CameraNotFoundException } = require('./CameraNotFoundException')

class CameraRegistry {

  constructor () {
    this.registry = []
  }

  addCamera ({ name, host, user, password }) {
    this.registry.push({ name, host, user, password })
  }

  findCamera (name) {
    for (const camera of this.registry) {
      if (camera.name === name) {
        return camera
      }
    }
    throw new CameraNotFoundException(name)
  }
}

module.exports = {
  CameraRegistry
}