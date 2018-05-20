'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {
  cameraDuplicatedErrorHandler,
  cameraNotFoundErrorHandler,
  generalNotFoundErrorHandler
} = require('./generalHandlers')

const {
  getCameraListing,
  retrieveCamera,
  saveCamera,
  deleteCamera,
  deleteCameras
} = require('./src/cameraRepository')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/cameras', async (req, res, next) => {

  try {
    const result = await saveCamera(req.body)
    res.status(201)
    res.header('Location', `/cameras/${req.body.name}`)
    res.send({
      name: req.body.name,
      uuid: result
    })
  } catch (e) {
    next(e)
  }
})

app.get('/cameras', async (req, res, next) => {

  try {
    const result = await getCameraListing()
    res.send(result)
  } catch (e) {
    next(e)
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

app.delete('/cameras/:cameraName', async (req, res, next) => {
  try {
    await deleteCamera(req.params.cameraName)
    res.send({
      message: `Camera ${req.params.cameraName} was deleted.`
    })
  } catch (e) {
    next(e)
  }
})

app.delete('/cameras', async (req, res, next) => {
  try {
    await deleteCameras()
    res.send({
      message: 'All cameras removed !!'
    })
  } catch (e) {
    next(e)
  }
})

app.use(cameraNotFoundErrorHandler)
app.use(cameraDuplicatedErrorHandler)
app.use(generalNotFoundErrorHandler)

module.exports = app