const request = require('supertest'),
      app = require('../src/app'),
      User = require('../src/models/user');

const testUser_1 = {
  name:"I am a test user",
  email:"test@test.com",
  password:"SerbiaStrong",
  age: 28
};

beforeEach(async ()=>{
  await User.deleteMany();
  await new User(testUser_1).save();
});

test('Should signup a new user', async()=>{
    await request(app).post('/users').send(
      {
        name:"Petar Yonkov",
        email:"10vpetyryonkov@gmail.com",
        password:"SerbiaStrong",
        age: 33
      }
    ).expect(201)
});


test('Should login the existing test user', async()=>{
 await request(app).post('/users/login').send({
   email: testUser_1.email,
   password:testUser_1.password
 }).expect(200)
});

test('Should fail @ login of the existing test user with bad data', async()=>{
  await request(app).post('/users/login').send({
    email: testUser_1.email,
    password:testUser_1.password + 'nfguiqwyh3t78912'
  }).expect(400)
});