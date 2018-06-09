'use strict'

const { CameraNotFoundException } = require('./CameraNotFoundException')

class CameraRegistry {
  get registry () {
    return this._registry
  }

  constructor () {
    this._registry = []
  }

  addCamera ({ name, host, user, password }) {
    this._registry.push({ name, host, user, password })
  }

  findCamera (name) {
    for (const camera of this._registry) {
      if (camera.name === name) {
        return camera
      }
    }
    throw new CameraNotFoundException(name)
  }

  delete (cameraName) {
    this._registry.forEach((currentValue, index, array) => {
      if (currentValue.name === cameraName) {
        delete array[index]
      }
    })
    this._registry = this._registry.filter((val) => val)
  }

  deleteAll () {
    this._registry = []
  }
}

module.exports = {
  CameraRegistry
}