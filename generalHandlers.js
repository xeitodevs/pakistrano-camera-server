const { DuplicatedCameraException } = require('./src/DuplicatedCameraException')
const { CameraNotFoundException } = require('./src/CameraNotFoundException')

function cameraNotFoundErrorHandler (err, req, res, next) {

  if (err instanceof CameraNotFoundException) {
    res.status(404)
    res.send({
      message: err.message
    })
  }
  next(err)
}

function cameraDuplicatedErrorHandler (err, req, res, next) {

  if (err instanceof DuplicatedCameraException) {
    res.status(409)
    res.send({
      message: err.message
    })
  }
  next(err)
}

function generalNotFoundErrorHandler (req, res) {
  res.status(404)
  res.send({
    message: 'Route not found.'
  })
}

module.exports = {
  cameraNotFoundErrorHandler,
  cameraDuplicatedErrorHandler,
  generalNotFoundErrorHandler
}