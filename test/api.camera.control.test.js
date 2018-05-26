const { serial: test } = require('ava')
const app = require('../app')
const {
  deleteCameras,
  saveCamera
} = require('../src/cameraRepository')

const request = require('supertest')
const { livingRoomCamera, expectedContentType } = require('./resources/fixtures')

const sinon = require('sinon')
const proxyquire = require('proxyquire')
let sandbox
let pakistranoCameraControlMock

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  pakistranoCameraControlMock = sandbox.mock()
  proxyquire('../index.js', {
    '../src/cameraFactory.js': {
      getCameraDriver: function (camera) {
        return pakistranoCameraControlMock
      }
    }
  })
  await deleteCameras()
})
test.afterEach(async () => {
  sandbox && sandbox.restore()
  await deleteCameras()
})

test('Ping one camera', async (t) => {
  await saveCamera(livingRoomCamera)
  const result = await request(app)
    .get(`/cameras/${livingRoomCamera.name}/ping`)
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  t.is(body, {
    camera: livingRoomCamera.name,
    ms: 23
  })
})