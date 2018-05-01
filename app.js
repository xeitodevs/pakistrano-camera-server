'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('./config')
const camera = require('./src/cameraAdapter')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/snapshot', async (req, res) => {

  try {
    const cameraResponse = await camera.getSnapshot()
    res.set('Content-Type', 'image/jpeg')
    res.send(cameraResponse)
  } catch (err) {

  }

})

app.get('/ping', async (req, res) => {

  try {
    const millis = await camera.ping()
    res.send({ millis })
  } catch (err) {

  }
})

app.post('/move-right', async (req, res) => {

  const cameraResponse = await camera.startMoveRight()
  res.send({
    message: cameraResponse
  })
})

app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

module.exports = app