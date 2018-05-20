'use strict'

const PakistranoCameraControl = require('pakistrano-camera-control')

function getCameraDriver ({ host, user, password }) {
  return new PakistranoCameraControl({
    host,
    user,
    password
  })
}

module.exports = {
  getCameraDriver
}