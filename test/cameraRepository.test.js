const test = require('ava')
const { door1Camera, livingRoomCamera } = require('./resources/fixtures')
const {
  connection,
  getCameraListing,
  retrieveCamera,
  saveCamera
} = require('../src/cameraRepository')

const clearDataBase = async function () {
  const db = await connection
  db.run('DELETE FROM camera')
}

test.beforeEach(clearDataBase)
test.afterEach(clearDataBase)

test.serial('Get camera must retrieve an specific camera in repository', async (t) => {

  await saveCamera(door1Camera)
  const cam2Uuid = await saveCamera(livingRoomCamera)
  const result = await retrieveCamera('livingroom')
  t.is(result.uuid, cam2Uuid)
})

test.serial('Save camera creation fields', async (t) => {

  await saveCamera(door1Camera)
  await saveCamera(livingRoomCamera)
  const result = await retrieveCamera('livingroom')
  t.true(result.uuid.length === 36)
})