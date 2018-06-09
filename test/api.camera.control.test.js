const { serial: test } = require('ava')
const stream = require('stream')

const app = require('../app')
const {
  deleteCameras,
  saveCamera
} = require('../src/cameraRepository')

const request = require('supertest')
const { livingRoomCamera, expectedContentType, expectedContentTypeStreams, expectedContentTypeHtml } = require('./resources/fixtures')

const sinon = require('sinon')
const proxyquire = require('proxyquire')
let sandbox
let pakistranoCameraControlMock

const pakistranoCameraControlStub = {
  ping: function () {},
  getSnapshot: function () {},
  getVideoStream: function () {},
  startMoveRight: function () {},
  startMoveLeft: function () {},
  centerCamera: function () {},
  stopAxes: function () {},
  startMoveUp: function () {},
  startMoveDown: function () {},
  startMoveBottomRight: function () {},
  startMoveBottomLeft: function () {},
  startMoveUpLeft: function () {},
  startMoveUpRight: function () {},
  startHorizontalPatrol: function () {},
  stopHorizontalPatrol: function () {},
  startVerticalPatrol: function () {},
  stopVerticalPatrol: function () {},
  activateIrView: function () {},
  deactivateIrView: function () {},
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
  const videoStream = stream.PassThrough()
  const content = Buffer.from('VideoStream')
  videoStream.end(content)
  pakistranoCameraControlMock.expects('getVideoStream').once().returns(videoStream)
  await saveCamera(livingRoomCamera)
  const result = await request(app)
    .get(`/cameras/${livingRoomCamera.name}/video-stream`)
    .expect('Content-Type', expectedContentTypeStreams)
    .expect(200)
  const body = result.body
  pakistranoCameraControlMock.verify()
  t.deepEqual(body, content)
})

async function cameraActionWithNoResponseMacro (t, command, expectedDriverCallFunction) {
  pakistranoCameraControlMock.expects(expectedDriverCallFunction).once()
  await saveCamera(livingRoomCamera)
  const result = await request(app)
    .post(`/cameras/${livingRoomCamera.name}/control`)
    .send({ command })
    .expect(204)

  const body = result.body
  pakistranoCameraControlMock.verify()
  t.deepEqual(body, {})
}

test(
  'Camera start move to right',
  cameraActionWithNoResponseMacro,
  'startMoveRight',
  'startMoveRight'
)
test('Camera start move to left',
  cameraActionWithNoResponseMacro,
  'startMoveLeft',
  'startMoveLeft'
)
test(
  'Camera start move center',
  cameraActionWithNoResponseMacro,
  'centerCamera',
  'centerCamera'
)
test(
  'Camera stop axes',
  cameraActionWithNoResponseMacro,
  'stopAxes',
  'stopAxes'
)

test(
  'Camera start move up',
  cameraActionWithNoResponseMacro,
  'startMoveUp',
  'startMoveUp'
)

test(
  'Camera start move down',
  cameraActionWithNoResponseMacro,
  'startMoveDown',
  'startMoveDown'
)

test(
  'Camera start move bottom right',
  cameraActionWithNoResponseMacro,
  'startMoveBottomRight',
  'startMoveBottomRight'
)

test(
  'Camera start move bottom left',
  cameraActionWithNoResponseMacro,
  'startMoveBottomLeft',
  'startMoveBottomLeft'
)

test(
  'Camera start move up left',
  cameraActionWithNoResponseMacro,
  'startMoveUpLeft',
  'startMoveUpLeft'
)

test(
  'Camera start move up right',
  cameraActionWithNoResponseMacro,
  'startMoveUpRight',
  'startMoveUpRight'
)

test(
  'Camera start horizontal patrol',
  cameraActionWithNoResponseMacro,
  'startHorizontalPatrol',
  'startHorizontalPatrol'
)

test(
  'Camera stop horizontal patrol',
  cameraActionWithNoResponseMacro,
  'stopHorizontalPatrol',
  'stopHorizontalPatrol'
)

test(
  'Camera start vertical patrol',
  cameraActionWithNoResponseMacro,
  'startVerticalPatrol',
  'startVerticalPatrol'
)

test(
  'Camera stop vertical patrol',
  cameraActionWithNoResponseMacro,
  'stopVerticalPatrol',
  'stopVerticalPatrol'
)

test(
  'Camera activate ir',
  cameraActionWithNoResponseMacro,
  'activateIrView',
  'activateIrView'
)

test(
  'Camera de-activate ir',
  cameraActionWithNoResponseMacro,
  'deactivateIrView',
  'deactivateIrView'
)