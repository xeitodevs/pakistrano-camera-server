const { CameraCommandNotAvailableException } = require('./CameraCommandNotAvailableException')

const commandsMapping = {
  startMoveRight:'startMoveRight',
  startMoveLeft:'startMoveLeft',
  centerCamera:'centerCamera',
  stopAxes:'  stopAxes',
  startMoveUp:'startMoveUp',
  startMoveDown:'startMoveDown',
  startMoveBottomRight:'startMoveBottomRight',
  startMoveBottomLeft:'startMoveBottomLeft',
  startMoveUpRight:'startMoveUpRight',
  startMoveUpLeft:'startMoveUpLeft',
  startHorizontalPatrol:'startHorizontalPatrol',
  stopHorizontalPatrol:'stopHorizontalPatrol',
  startVerticalPatrol:'startVerticalPatrol',
  stopVerticalPatrol:'stopVerticalPatrol',
  activateIrView:'activateIrView',
  deactivateIrView: 'deactivateIrView'
}

function getCorrectDriverCallFunc (command) {
  const funcName = Object.keys(commandsMapping).find((elem) => {
    if (elem === command) {
      return elem
    }
  })
  if (!funcName) {
    throw new CameraCommandNotAvailableException(command)
  }
  return funcName
}

module.exports = {
  getCorrectDriverCallFunc
}
