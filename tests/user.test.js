const request = require('supertest'),
      jwt = require ('jsonwebtoken'),
      mongoose = require ('mongoose'),
      app = require('../src/app'),
      User = require('../src/models/user');

const testUser_1_id = new mongoose.Types.ObjectId();
const testUser_1 = {
  _id: testUser_1_id,
  name:"I am a test user",
  email:"test@test.com",
  password:"SerbiaStrong",
  age: 28,
  tokens:[{
   token: jwt.sign({_id:testUser_1_id}, process.env.JWT_SECRET)
  }]
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
        password:"SerbiaStrong"
      }
    ).expect(201)
});

test('Should fail @ signup without email', async()=>{
  await request(app).post('/users').send(
    {
      name:"Petar Yonkov",
      password:"SerbiaStrong"
    }
  ).expect(400)
});

test('Should fail @ signup without password', async()=>{
  await request(app).post('/users').send(
    {
      name:"Petar Yonkov",
      email:"10vpetyryonkov@gmail.com"
    }
  ).expect(400)
});

test('Should login the existing test user', async()=>{
 await request(app)
   .post('/users/login')
   .send({
   email: testUser_1.email,
   password:testUser_1.password
 }).expect(200)
});

test('Should fail @ login of the existing test user with bad data', async()=>{
  await request(app)
    .post('/users/login')
    .send({
    email: testUser_1.email,
    password:testUser_1.password + 'nfguiqwyh3t78912'
  }).expect(400)
});

test('Should get the profile with auth', async()=>{
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send()
    .expect(200)
});

test('Should fail to get the profile without auth', async()=>{
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
});

test('Should delete the profile with auth', async()=>{
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send()
    .expect(200)
});

test('Should fail to delete the profile without auth', async()=>{
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});