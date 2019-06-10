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

test('Should succeed@ signup for a valid new user', async()=>{
  const payload = {
    name: "PIY",
    email:"10v@test.com",
    password:"whatever_pass_works!!"
  };
  const response = await request(app).post('/users')
    .send(payload)
    .expect(201);
  //assert that this user exists
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  //assertions about the response
  expect(response.body.user.name).toBe('PIY');
  expect(response.body.user.password).not.toBe(payload.password);
});

test('Should fail @ signup without email', async()=>{
  await request(app).post('/users')
    .send({
      name:testUser_1.name,
      password:testUser_1.password
    }
  )
    .expect(400)
});

test('Should fail @ signup without password', async()=>{
  await request(app).post('/users')
    .send({
      name:testUser_1.name,
      email:testUser_1.email
    }
  )
    .expect(400)
});

test('Should fail @ signup with a very high age (above 130)', async()=>{
  await request(app).post('/users')
    .send({
        name:testUser_1.name,
        email:testUser_1.email,
        password:testUser_1.password,
        age:testUser_1.age + 150
      }
    )
    .expect(400)
});

test('Should fail @ signup with a very low age (below 13)', async()=>{
  await request(app).post('/users')
    .send({
        name:testUser_1.name,
        email:testUser_1.email,
        password:testUser_1.password,
        age:testUser_1.age-20
      }
    )
    .expect(400)
});

test('Should succeed @ login for an existing test user', async()=>{
 const response = await request(app)
   .post('/users/login')
   .send({
     email: testUser_1.email,
     password:testUser_1.password
   })
   .expect(200);
  const user = await User.findById(testUser_1_id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should fail @ login of the existing test user with bad data', async()=>{
  await request(app)
    .post('/users/login')
    .send({
      email: testUser_1.email,
      password:testUser_1.password + 'nfguiqwyh3t78912'
  }).expect(400)
});

test('Should succeed @ changing the profile with good data', async()=>{
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send({
      name: "Allahu"
    })
    .expect(200)
});

test('Should fail @ changing the profile with bad data', async()=>{
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send({
      name: "Allahu",
      location: "tora-bora"
    })
    .expect(400)
});

test('Should succeed @ geting the profile with auth', async()=>{
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send()
    .expect(200)
});

test('Should fail @ getting the profile without auth', async()=>{
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
});

test('Should succeed@ deleting the profile with auth', async()=>{
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(testUser_1_id);
  expect(user).toBeNull();
});

test('Should fail @ deleting the profile without auth', async()=>{
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});

test('Should succeed @ upload avatar image for good img', async()=>{
  await request(app)
    .post('/users/me/avatar')
    .set ('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .attach('profile_image', 'tests/fixtures/pass.PNG')
    .expect(200);
  const user = await User.findById(testUser_1_id);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should fail @ upload avatar image for too large img', async()=>{
  await request(app)
    .post('/users/me/avatar')
    .set ('Authorization', `Bearer ${testUser_1.tokens[0].token}`)
    .attach('profile_image', 'tests/fixtures/too_large.jpg')
    .expect(400)
});