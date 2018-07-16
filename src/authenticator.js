const { AuthException } = require('./AuthException')

function authenticate (token, expectedToken) {
  if (token !== expectedToken) {
    throw new AuthException('Cannot authenticate')
  }
}

module.exports = {
  authenticate
}