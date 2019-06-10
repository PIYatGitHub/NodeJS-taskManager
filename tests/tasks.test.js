const request = require('supertest'),
  jwt = require ('jsonwebtoken'),
  mongoose = require ('mongoose'),
  app = require('../src/app'),
  Task = require('../src/models/task'),
  User = require('../src/models/user');

const {testUser_1_id, testUser_1, setupDB} = require('./fixtures/db');

beforeEach(setupDB);

test('Should succeed@ creating a task as a user with auth', async()=>{
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send({
      description:'For the test!'
    })
    .expect(201)
});