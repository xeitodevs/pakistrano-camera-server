const { serial: test } = require('ava')
const { getAppInstance } = require('../appFactory')
const {
  deleteCameras,
  saveCamera,
  retrieveCamera,
  getCameraListing
} = require('../src/cameraRepository')

const request = require('supertest')
const { livingRoomCamera, door1Camera, expectedContentType } = require('./resources/fixtures')
const { assertUuid } = require('./resources/helpers')

test.beforeEach(deleteCameras)
test.afterEach(deleteCameras)

test('Registering new cameras must respond properly', async (t) => {
  const result = await request(getAppInstance())
    .post('/cameras')
    .expect('Content-Type', expectedContentType)
    .expect('Location', `/cameras/${livingRoomCamera.name}`)
    .expect(201)
    .send(livingRoomCamera)

  const body = result.body

  t.is(body.name, livingRoomCamera.name)
  assertUuid(t, body.uuid)
})

test('Registering new cameras duplicated must be conflict', async (t) => {

  await saveCamera(livingRoomCamera)
  const result = await request(getAppInstance())
    .post('/cameras')
    .expect('Content-Type', expectedContentType)
    .expect(409)
    .send(livingRoomCamera)
  const body = result.body
  t.is(body.message, `Camera name ${livingRoomCamera.name} is duplicated`)
})

test('Listing registered cameras', async (t) => {
  const uuidDoor1Camera = await saveCamera(door1Camera)
  const uuidLivingRoom = await saveCamera(livingRoomCamera)
  const result = await request(getAppInstance())
    .get('/cameras')
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is(2, body.length)
  t.is(uuidDoor1Camera, body[0].uuid)
  t.is(uuidLivingRoom, body[1].uuid)
})

test('Get specific camera by name', async (t) => {
  await saveCamera(door1Camera)
  const uuidLivingRoom = await saveCamera(livingRoomCamera)
  const result = await request(getAppInstance())
    .get(`/cameras/${livingRoomCamera.name}`)
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is(uuidLivingRoom, body.uuid)
})

test('Get specific camera by name, not found', async (t) => {

  const cameraToSearch = 'unknown404'
  const result = await request(getAppInstance())
    .get(`/cameras/${cameraToSearch}`)
    .expect('Content-Type', expectedContentType)
    .expect(404)

  const body = result.body
  t.is(body.message, `Cannot find camera ${cameraToSearch}`)
})

test('Delete specific camera by name', async (t) => {
  await saveCamera(livingRoomCamera)
  await saveCamera(door1Camera)

  const result = await request(getAppInstance())
    .delete(`/cameras/${livingRoomCamera.name}`)
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is(`Camera ${livingRoomCamera.name} was deleted.`, body.message)
  const existingCameras = await getCameraListing()
  t.is(1, existingCameras.length)
  t.is(door1Camera.name, existingCameras[0].name)
})

test('Delete specific camera by name, not found', async (t) => {

  const cameraToSearch = 'unknown404'
  const result = await request(getAppInstance())
    .delete(`/cameras/${cameraToSearch}`)
    .expect('Content-Type', expectedContentType)
    .expect(404)
  const body = result.body
  t.is(body.message, `Cannot find camera ${cameraToSearch}`)
})

test('Delete all cameras', async (t) => {
  await saveCamera(livingRoomCamera)
  await saveCamera(door1Camera)
  const result = await request(getAppInstance())
    .delete('/cameras')
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is('All cameras removed !!', body.message)
  const existingCameras = await getCameraListing()
  t.is(0, existingCameras.length)
})

test('We can update a camera', async (t) => {
  await saveCamera(livingRoomCamera)
  const newInfo = {
    name: 'livingRoomCameraNewName',
    host: 'new.host.com',
    user: 'new_user',
    password: 'newPassword'
  }
  await request(getAppInstance())
    .put(`/cameras/${livingRoomCamera.name}`)
    .expect(200)
    .send(newInfo)
  const resultantCamera = await retrieveCamera(newInfo.name)
  t.is(newInfo.name, resultantCamera.name)
  t.is(newInfo.host, resultantCamera.host)
  t.is(newInfo.user, resultantCamera.user)
  t.is(newInfo.password, resultantCamera.password)
})