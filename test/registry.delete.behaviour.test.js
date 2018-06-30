const { serial: test } = require('ava')
const { getAppInstance } = require('../appFactory')
const request = require('supertest')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const { CameraRegistry } = require('../src/CameraRegistry')
const { door1Camera } = require('./resources/fixtures')
const { saveCamera } = require('./../src/cameraRepository')

let sandbox
let cameraRegistryStub

test.before(() => {
  sandbox = sinon.createSandbox()
  cameraRegistryStub = sandbox.createStubInstance(CameraRegistry)
  sandbox.stub(CameraRegistry.prototype, 'delete')
  sandbox.stub(CameraRegistry.prototype, 'deleteAll')
  proxyquire('../index.js', {
    './src/CameraRegistry.js': { CameraRegistry }
  })
})

test.afterEach(() => sandbox && sandbox.reset())

test('Camera server must remove a camera when remove action is triggered', async (t) => {
  await saveCamera(door1Camera)
  await request(getAppInstance())
    .delete(`/cameras/${door1Camera.name}`)
  sinon.assert.calledOnce(CameraRegistry.prototype.delete)
  sinon.assert.notCalled(CameraRegistry.prototype.deleteAll)
  t.pass()
})


test('Camera server must remove a camera when update action is triggered', async (t) => {
  await saveCamera(door1Camera)
  await request(getAppInstance())
    .put(`/cameras/${door1Camera.name}`)
  sinon.assert.calledOnce(CameraRegistry.prototype.delete)
  sinon.assert.notCalled(CameraRegistry.prototype.deleteAll)
  t.pass()
})

test('Camera server must remove all cameras when remove all action is triggered', async (t) => {
  await request(getAppInstance())
    .delete('/cameras')
  sinon.assert.calledOnce(CameraRegistry.prototype.deleteAll)
  sinon.assert.notCalled(CameraRegistry.prototype.delete)
  t.pass()
})