const { serial: test } = require('ava')
const app = require('../app')
const {
  deleteCameras,
  saveCamera
} = require('../src/cameraRepository')

const request = require('supertest')
const { livingRoomCamera, expectedContentType, expectedContentTypeStreams } = require('./resources/fixtures')

const sinon = require('sinon')
const proxyquire = require('proxyquire')
let sandbox
let pakistranoCameraControlMock

const pakistranoCameraControlStub = {
  ping: function () {},
  getSnapshot: function () {},
  getVideoStream: function () {}
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  pakistranoCameraControlMock = sandbox.mock(pakistranoCameraControlStub)
  proxyquire('../index.js', {
    './src/cameraFactory.js': {
      getCameraDriver: function (camera) {
        return pakistranoCameraControlStub
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
  const ms = 23
  pakistranoCameraControlMock.expects('ping').once().returns(ms)
  await saveCamera(livingRoomCamera)
  const result = await request(app)
    .get(`/cameras/${livingRoomCamera.name}/ping`)
    .expect('Content-Type', expectedContentType)
    .expect(200)
  const body = result.body
  pakistranoCameraControlMock.verify()
  t.deepEqual(body, { ms })
})

test('Get snapshot from camera', async (t) => {
  const snapshot = Buffer.from('SNAPSHOT')
  pakistranoCameraControlMock.expects('getSnapshot').once().returns(snapshot)
  await saveCamera(livingRoomCamera)
  const result = await request(app)
    .get(`/cameras/${livingRoomCamera.name}/snapshot`)
    .expect('Content-Type', expectedContentTypeStreams)
    .expect(200)
  const body = result.body
  pakistranoCameraControlMock.verify()
  t.deepEqual(body, snapshot)
})

test('Get video stream from camera', async (t) => {
  const videoStream = Buffer.from('VideoStream')
  pakistranoCameraControlMock.expects('getVideoStream').once().returns(videoStream)
  await saveCamera(livingRoomCamera)
  const result = await request(app)
    .get(`/cameras/${livingRoomCamera.name}/video-stream`)
    .expect('Content-Type', expectedContentTypeStreams)
    .expect(200)
  const body = result.body
  pakistranoCameraControlMock.verify()
  t.deepEqual(body, videoStream)
})