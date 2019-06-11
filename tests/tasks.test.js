const request = require('supertest'),
  jwt = require ('jsonwebtoken'),
  mongoose = require ('mongoose'),
  app = require('../src/app'),
  Task = require('../src/models/task'),
  User = require('../src/models/user');

const { testUser_1_id, testUser_1,
        testUser_2_id, testUser_2,
        task_1, task_2,
        task_3, task_4,
        task_5, task_6,
      setupDB} = require('./fixtures/db');

beforeEach(setupDB);

test('Should succeed@ creating a task as a user with auth', async()=>{
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send({
      description:'For the test!'
    })
    .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.complete).toEqual(false);
});

test('Should succeed@ getting the tasks for a specific user with auth', async()=>{
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send({})
    .expect(200);
  expect(response.body.length).toEqual(4)
});

test('Should fail@ deleting other user tasks', async()=>{
  const response = await request(app)
    .delete(`/tasks/${task_1._id}`)
    .set('Authorization', `Bearer ${testUser_2.tokens[0].token}`)
    .send({})
    .expect(404);
  const task = await Task.findById(task_1._id);
  expect (task).not.toBeNull(); 
});