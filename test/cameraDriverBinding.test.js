const { CameraCommandNotAvailableException } = require('../src/CameraCommandNotAvailableException')
const { test } = require('ava')
const { getCorrectDriverCallFunc } = require('../src/cameraDriverBinding')

test('Test find correct driver function unit test', (t) => {
  const result = getCorrectDriverCallFunc('startMoveLeft')
  t.is(result, 'startMoveLeft')
})

test('Throws correct exception on not available command unit test', (t) => {
  const unknownCommand = 'UNKNOWN_COMMAND'
  const exception = t.throws(() => {
    getCorrectDriverCallFunc(unknownCommand)
  }, CameraCommandNotAvailableException)
  t.is(exception.message, `Cannot find command ${unknownCommand}`)
})