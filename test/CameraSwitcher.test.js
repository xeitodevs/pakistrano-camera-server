const { serial: test } = require('ava')
const sinon = require('sinon')
const { door1Camera } = require('./resources/fixtures')
const { CameraSwitcher } = require('../src/CameraSwitcher')
let sandbox

const fakeCameraRegistry = {
  findCamera: function (name) {},
  addCamera: function (camera) {}
}

test.beforeEach(() => {
  sandbox = sinon.createSandbox()
})
test.afterEach(() => sandbox.restore())

test('Camera switcher first of all tries registry', async (t) => {

  const cameraRegistryMock = sandbox.mock(fakeCameraRegistry)
  cameraRegistryMock.expects('findCamera').once().returns(door1Camera)
  cameraRegistryMock.expects('addCamera').never()
  const cameraRetrieveSpy = sandbox.spy()
  const cameraSwitcher = new CameraSwitcher(fakeCameraRegistry, cameraRetrieveSpy)
  const result = await cameraSwitcher.perform(door1Camera.name)
  cameraRegistryMock.verify()
  t.false(cameraRetrieveSpy.called)
  t.deepEqual(result, door1Camera)
})

test('Camera switcher after registry try failed, goes for repository, saving to registry', async (t) => {

  const cameraRegistryMock = sandbox.mock(fakeCameraRegistry)
  cameraRegistryMock.expects('findCamera').once().returns(null)
  cameraRegistryMock.expects('addCamera').once().withArgs(door1Camera)
  const cameraRetrieveStub = sandbox.stub()
  cameraRetrieveStub.returns(door1Camera)
  const cameraSwitcher = new CameraSwitcher(fakeCameraRegistry, cameraRetrieveStub)
  const result = await cameraSwitcher.perform(door1Camera.name)
  cameraRegistryMock.verify()
  t.true(cameraRetrieveStub.called)
  t.deepEqual(result, door1Camera)
})

