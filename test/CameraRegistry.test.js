const test = require('ava')
const { CameraNotFoundException } = require('../src/CameraNotFoundException')
const { CameraRegistry } = require('../src/CameraRegistry')
const { door1Camera, livingRoomCamera } = require('./resources/fixtures')

let registry

test.beforeEach(() => {
  registry = new CameraRegistry()
})

test('Registry must add cameras without error', (t) => {
  registry.addCamera(livingRoomCamera)
  t.is(registry.registry.length, 1)
})

test('Registry must find by name previously saved camera', (t) => {
  registry.addCamera(livingRoomCamera)
  registry.addCamera(door1Camera)
  const searchResult = registry.findCamera('door1')
  t.deepEqual(searchResult, door1Camera)
})

test('Registry must throw an exception when camera not found', (t) => {
  const wantedCamera = 'door1'
  const exception = t.throws(() => {
    registry.findCamera(wantedCamera)
  }, CameraNotFoundException)
  t.is(exception.message, `Cannot find camera ${wantedCamera}`)
})