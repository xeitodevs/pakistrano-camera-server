const test = require('ava')
const { AuthException } = require('../src/AuthException')
const { authenticate } = require('../src/authenticator')

test('Must authenticate when token is same as expected token unit test', (t) => {
  t.notThrows(authenticate.bind(null, 'TOK123', 'TOK123'))
})

function testExceptionMacron (t, token, expectedToken) {
  const error = t.throws(authenticate.bind(null, token, expectedToken), AuthException)
  t.is(error.message, 'Cannot authenticate')
}

test('Must throw exception when no authentication takes place unit test', testExceptionMacron, 'TOK123', '123')
test('Must throw exception when no authentication takes place (checking strict type) unit test', testExceptionMacron, '123', 123)