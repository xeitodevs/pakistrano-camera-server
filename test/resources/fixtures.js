const livingRoomCamera = {
  name: 'livingroom',
  host: '192.168.1.1',
  user: 'admin',
  password: 'qwerty'
}

const door1Camera = {
  name: 'door1',
  host: '192.168.1.2',
  user: 'admin',
  password: 'yterwq'
}

const expectedContentType = 'application/json; charset=utf-8'
const expectedContentTypeStreams = 'application/octet-stream'

module.exports = {
  livingRoomCamera,
  door1Camera,
  expectedContentType,
  expectedContentTypeStreams
}