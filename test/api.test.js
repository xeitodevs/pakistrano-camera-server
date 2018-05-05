const test = require('ava')
const app = require('../app')
const {
  deleteCameras,
  saveCamera,
  getCameraListing
} = require('../src/cameraRepository')

const request = require('supertest')
const { livingRoomCamera, door1Camera } = require('./resources/fixtures')
const { assertUuid } = require('./resources/helpers')

test.beforeEach(deleteCameras)
test.afterEach(deleteCameras)

const expectedContentType = 'application/json; charset=utf-8'

test.serial('Api - Registering new cameras must respond properly', async (t) => {
  const result = await request(app)
    .post('/cameras')
    .expect('Content-Type', expectedContentType)
    .expect('Location', `/cameras/${livingRoomCamera.name}`)
    .expect(201)
    .send(livingRoomCamera)

  const body = result.body

  t.is(body.name, livingRoomCamera.name)
  assertUuid(t, body.uuid)
})


test.serial('Api - Registering new cameras duplicated must be conflict', async (t) => {

  await saveCamera(livingRoomCamera)
  const result = await request(app)
    .post('/cameras')
    .expect('Content-Type', expectedContentType)
    .expect(409)
    .send(livingRoomCamera)
  const body = result.body
  t.is(body.message, `Camera name ${livingRoomCamera.name} is duplicated`)
})

test.serial('Api - Listing registered cameras', async (t) => {
  const uuidDoor1Camera = await saveCamera(door1Camera)
  const uuidLivingRoom = await saveCamera(livingRoomCamera)
  const result = await request(app)
    .get('/cameras')
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is(2, body.length)
  t.is(uuidDoor1Camera, body[0].uuid)
  t.is(uuidLivingRoom, body[1].uuid)
})

test.serial('Api - Get specific camera by name', async (t) => {
  await saveCamera(door1Camera)
  const uuidLivingRoom = await saveCamera(livingRoomCamera)
  const result = await request(app)
    .get(`/cameras/${livingRoomCamera.name}`)
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is(uuidLivingRoom, body.uuid)
})

test.serial('Api - Get specific camera by name, not found', async (t) => {

  const cameraToSearch = 'unknown404'
  const result = await request(app)
    .get(`/cameras/${cameraToSearch}`)
    .expect('Content-Type', expectedContentType)
    .expect(404)

  const body = result.body
  t.is(body.message, `Cannot find camera ${cameraToSearch}`)
})

test.serial('Api - Delete specific camera by name', async (t) => {
  await saveCamera(livingRoomCamera)
  await saveCamera(door1Camera)

  const result = await request(app)
    .delete(`/cameras/${livingRoomCamera.name}`)
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is(`Camera ${livingRoomCamera.name} was deleted.`, body.message)
  const existingCameras = await getCameraListing()
  t.is(1, existingCameras.length)
  t.is(door1Camera.name, existingCameras[0].name)
})

test.serial('Api - Delete specific camera by name, not found', async (t) => {

  const cameraToSearch = 'unknown404'
  const result = await request(app)
    .delete(`/cameras/${cameraToSearch}`)
    .expect('Content-Type', expectedContentType)
    .expect(404)
  const body = result.body
  t.is(body.message, `Cannot find camera ${cameraToSearch}`)
})

test.serial('Api - Delete all cameras', async (t) => {
  await saveCamera(livingRoomCamera)
  await saveCamera(door1Camera)
  const result = await request(app)
    .delete('/cameras')
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is('All cameras removed !!', body.message)
  const existingCameras = await getCameraListing()
  t.is(0, existingCameras.length)
})