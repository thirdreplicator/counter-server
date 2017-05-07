process.env.NODE_ENV = 'test'

var server = require('../src/server')
const BASE = 'http://localhost:3000'
const PORT = 3000
const app = server.listen(PORT)

const request = require('supertest').agent(app)
var chai = require('chai')

var expect = chai.expect

describe('Counter server', () => {
  after(function (done) {
    app.close();
    done();
  });

  describe('/', async () => {
    it('should be live', () => {
      return request
        .get('/')
        .expect(200, '{}')
    })

    it('should return the value of all counters being tracked.', async () => {
      await request.post('/inc/a')
      await request.post('/inc/b')
      await request.post('/inc/b')
      await request.post('/inc/c')
      await request.post('/inc/c')
      await request.post('/inc/c')
      return request.get('/').expect({a: 1, b: 2, c:3})
    })
  })

  describe('/counters/:id', () => {
    it('should return json', () => {
      return request
               .get('/counters/z')
               .expect('Content-Type', /json/)
    })

    it('should return 0 for a new (undefined) counter', () => {
      return request
               .get('/counters/z')
               .expect('0')
    })

    it('should return 3 after being incremented 3 times', async () => {
      await request.post('/inc/z')
      await request.post('/inc/z')
      await request.post('/inc/z')
      return request
               .get('/counters/z')
               .expect('3')
    })

    it('should not change the value of z', async() => {
      await request.get('/counters/z')
      await request.get('/counters/z')
      return request
               .get('/counters/z')
               .expect('3')
    })
  })

  describe('/inc/:id', () => {
    it('should return json', () => {
      return request
        .post('/inc/asdf')
        .expect('Content-Type', /json/)
    }) // it

    it('should return 1 the first time', () => {
      return request
        .post('/inc/x')
        .expect('1')
    }) // it

    it('should return 2 if incremented twice', async () => {
      await request.post('/inc/moo').expect('1')
      return request.post('/inc/moo').expect('2')
    }) // it
  }) // describe /inc/<COUNTER_NAME>


  describe('/reset/:id', () => {
    it('should reset a counter to 0', async () => {
      await request.post('/inc/cow').expect('1')
      await request.post('/inc/cow').expect('2')
      await request.post('/inc/cow').expect('3')
      await request.get('/counters/cow').expect('3')
      await request.post('/reset/cow')
      return request.get('/counters/cow').expect('0')
    })
  })

  describe('/reset/:id/:value', () => {
    it('should set the counter to a particular value', async () => {
      await request.get('/counters/fish').expect('0')
      await request.post('/reset/fish/5042')
      return request.get('/counters/fish').expect('5042')
    })
  })

  describe('/reset/all', () => {
    it('should reset the counters to 0', async () => {
      await request.post('/reset/all')
      await request.get('/counters/moo').expect('0')
      await request.get('/counters/cow').expect('0')
      await request.get('/counters/fish').expect('0')
      return request.get('/counters/x').expect('0')
    })
  })

  describe('*', () => {
    it('should return a server status code of 500', () => {
      return request.get('/non-existent')
               .expect(500, {error: 'not found'})
    })
  })
})
