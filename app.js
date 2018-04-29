const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('./config')
const camera = require('./src/cameraAdapter')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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

app.listen(config.port, () => {
  console.log(`Pakistrano camera server is running at ${config.port}`)
})



