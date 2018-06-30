const { serial: test} = require('ava')
const { CameraDuplicatedException } = require('../src/DuplicatedCameraException')
const { CameraNotFoundException } = require('../src/CameraNotFoundException')
const { door1Camera, livingRoomCamera } = require('./resources/fixtures')
const { assertNearDate, assertUuid} = require('./resources/helpers')

const {
  getCameraListing,
  retrieveCamera,
  saveCamera,
  deleteCamera,
  deleteCameras,
  updateCamera
} = require('../src/cameraRepository')

test.beforeEach(deleteCameras)
test.afterEach(deleteCameras)

test('Get camera must retrieve an specific camera in repository', async (t) => {

  await saveCamera(door1Camera)
  const cam2Uuid = await saveCamera(livingRoomCamera)
  const result = await retrieveCamera(livingRoomCamera.name)
  t.is(result.uuid, cam2Uuid)
})
test('Get camera must retrieve an specific camera in repository, exception on not found', async (t) => {
  const wantedCamera = 'unknownCamera'
  const exception = await t.throws(retrieveCamera(wantedCamera), CameraNotFoundException)
  t.is(exception.message, `Cannot find camera ${wantedCamera}`)
})

test('Save camera creation fields', async (t) => {

  await saveCamera(door1Camera)
  await saveCamera(livingRoomCamera)
  const result = await retrieveCamera(livingRoomCamera.name)
  t.is(result.name, livingRoomCamera.name)
  t.is(result.host, livingRoomCamera.host)
  t.is(result.user, livingRoomCamera.user)
  t.is(result.password, livingRoomCamera.password)
  assertUuid(t, result.uuid)
  assertNearDate(t, new Date(result.createdAt), new Date(), 1000)
})

test('Save same camera twice must be exception due to duplicated name', async (t) => {
  await saveCamera(livingRoomCamera)
  const exception = await t.throws(saveCamera(livingRoomCamera), CameraDuplicatedException)
  t.is(exception.message, `Camera name ${livingRoomCamera.name} is duplicated`)
})

test('Must return a listing with all cameras', async (t) => {
  const uuid1 = await saveCamera(door1Camera)
  const uuid2 = await saveCamera(livingRoomCamera)
  const result = await getCameraListing()
  t.is(uuid1, result[0].uuid)
  t.is(uuid2, result[1].uuid)
})

test('Must remove specific camera', async (t) => {
  await saveCamera(door1Camera)
  await saveCamera(livingRoomCamera)
  await deleteCamera(livingRoomCamera.name)
  const result = await getCameraListing()
  t.is(1, result.length)
  t.is(door1Camera.name, result[0].name)
})

test('Must remove specific camera, exception on not found', async (t) => {
  const wantedCamera = 'unknownCamera'
  const exception = await t.throws(deleteCamera(wantedCamera), CameraNotFoundException)
  t.is(exception.message, `Cannot find camera ${wantedCamera}`)
})

test('Must remove all cameras', async (t) => {
  await saveCamera(door1Camera)
  await saveCamera(livingRoomCamera)
  await deleteCameras()
  const result = await getCameraListing()
  t.is(0, result.length)
})


test('Update camera creation fields', async (t) => {

  await saveCamera(livingRoomCamera)
  const newInfo = {
    name: 'livingRoomCameraNewName',
    host: 'new.host.com',
    user: 'new_user',
    password: 'newPassword'
  }
  await updateCamera(livingRoomCamera.name, newInfo)
  const result = await retrieveCamera(newInfo.name)
  t.is(result.name, newInfo.name)
  t.is(result.host, newInfo.host)
  t.is(result.user, newInfo.user)
  t.is(result.password, newInfo.password)
  assertNearDate(t, new Date(result.updatedAt), new Date(), 1000)
})