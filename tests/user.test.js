const request = require('supertest'),
      app = require('../src/app');

test('Should signup a new user', async()=>{
    await request(app).post('/users').send(
      {
        name:"Petar Yonkov",
        email:"10vpetyryonkov@gmail.com",
        password:"SerbiaStrong",
        age: 27
      }
    )
});