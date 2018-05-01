const test = require('ava')
const app = require('../app')
const request = require('supertest')

test.skip('Registering new cameras must respond ok', async (t) => {

  const result = await request(app)
    .post('/cameras/livingroom')
    .expect('Content-Type', '/json/')
    .expect(200)
    .send(
      { host: 'ava@rocks.com', user: '123123', password: 'qwerty' }
    )

  //t.is(result.statusCode, 200)
  //  console.log(result.body)

})