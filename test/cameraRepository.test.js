const test = require('ava')
const { door1Camera, livingRoomCamera } = require('./resources/fixtures')
const { assertNearDate } = require('./resources/helpers')

const {
  getCameraListing,
  retrieveCamera,
  saveCamera,
  deleteCameras
} = require('../src/cameraRepository')

test.beforeEach(deleteCameras)
test.afterEach(deleteCameras)

test.serial('Get camera must retrieve an specific camera in repository', async (t) => {

  await saveCamera(door1Camera)
  const cam2Uuid = await saveCamera(livingRoomCamera)
  const result = await retrieveCamera(livingRoomCamera.name)
  t.is(result.uuid, cam2Uuid)
})

test.serial('Save camera creation fields', async (t) => {

  await saveCamera(door1Camera)
  await saveCamera(livingRoomCamera)
  const result = await retrieveCamera(livingRoomCamera.name)
  t.true(result.uuid.length === 36)
  t.is(result.name, livingRoomCamera.name)
  t.is(result.host, livingRoomCamera.host)
  t.is(result.user, livingRoomCamera.user)
  t.is(result.password, livingRoomCamera.password)
  assertNearDate(t, new Date(result.createdAt), new Date(), 1000)
})

test.serial('Must return a listing with all cameras', async (t) => {
  const uuid1 = await saveCamera(door1Camera)
  const uuid2 = await saveCamera(livingRoomCamera)
  const result = await getCameraListing()
  t.is(uuid1, result[0].uuid)
  t.is(uuid2, result[1].uuid)
})