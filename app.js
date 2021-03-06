'use strict'

const config = require('./config')
const express = require('express')
const bearerToken = require('express-bearer-token')

const app = express()
const cors = require('cors')

const bodyParser = require('body-parser')
const { authenticate } = require('./src/authenticator')
const { getCorrectDriverCallFunc } = require('./src/cameraDriverBinding')
const {
  cameraDuplicatedErrorHandler,
  cameraNotFoundErrorHandler,
  generalNotFoundErrorHandler,
  authenticationHandler
} = require('./errorHandlers')

const {
  getCameraListing,
  retrieveCamera,
  saveCamera,
  updateCamera,
  deleteCamera,
  deleteCameras
} = require('./src/cameraRepository')

app.use(bearerToken())
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

// Basic auth token control
app.use((req, res, next) => {
  try {
    if (config.environment === 'production') {
      authenticate(req.token, config.authToken)
    }
    next()
  } catch (err) {
    next(err)
  }
})

app.post('/cameras', async (req, res, next) => {

  try {
    const result = await saveCamera(req.body)
    res.status(201)
    res.header('Location', `/cameras/${req.body.name}`)
    res.send({
      name: req.body.name,
      uuid: result
    })
  } catch (err) {
    next(err)
  }
})

app.get('/cameras', async (req, res, next) => {

  try {
    const result = await getCameraListing()
    res.send(result)
  } catch (err) {
    next(err)
  }
})

app.get('/cameras/:cameraName', async (req, res, next) => {
  try {
    const result = await retrieveCamera(req.params.cameraName)
    res.send(result)
  } catch (err) {
    next(err)
  }
})

app.put('/cameras/:cameraName', async (req, res, next) => {
  try {
    req.app.services.cameraRegistry.delete(req.params.cameraName)
    const result = await updateCamera(req.params.cameraName, req.body)
    res.send(result)
  } catch (err) {
    next(err)
  }
})

app.delete('/cameras/:cameraName', async (req, res, next) => {
  try {
    req.app.services.cameraRegistry.delete(req.params.cameraName)
    await deleteCamera(req.params.cameraName)
    res.send({
      message: `Camera ${req.params.cameraName} was deleted.`
    })
  } catch (err) {
    next(err)
  }
})

app.delete('/cameras', async (req, res, next) => {
  try {
    req.app.services.cameraRegistry.deleteAll()
    await deleteCameras()
    res.send({
      message: 'All cameras removed !!'
    })
  } catch (err) {
    next(err)
  }
})

app.get('/cameras/:cameraName/ping', async (req, res, next) => {

  try {
    const camera = await req.app.services.cameraSwitcher.perform(req.params.cameraName)
    const ms = await camera.ping()
    res.send({ ms })
  } catch (err) {
    next(err)
  }

})

app.get('/cameras/:cameraName/snapshot', async (req, res, next) => {

  try {
    const camera = await req.app.services.cameraSwitcher.perform(req.params.cameraName)
    res.send(await camera.getSnapshot())
  } catch (err) {
    next(err)
  }
})

app.get('/cameras/:cameraName/video-stream', async (req, res, next) => {

  try {
    const camera = await req.app.services.cameraSwitcher.perform(req.params.cameraName)
    const videoStream = await camera.getVideoStream()
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream'
    })
    videoStream.pipe(res)
  } catch (err) {
    next(err)
  }
})

app.post('/cameras/:cameraName/control', async (req, res, next) => {

  try {
    const camera = await req.app.services.cameraSwitcher.perform(req.params.cameraName)
    const driverFunc = getCorrectDriverCallFunc(req.body.command)
    await camera[driverFunc]()
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

app.use(cameraNotFoundErrorHandler)
app.use(cameraDuplicatedErrorHandler)
app.use(authenticationHandler)
app.use(generalNotFoundErrorHandler)

module.exports = app