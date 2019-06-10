const mongoose= require ('mongoose'),
      jwt = require ('jsonwebtoken'),
      User = require('../../src/models/user');


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

const setupDB = async ()=>{
  await User.deleteMany();
  await new User(testUser_1).save();
};

module.exports={
testUser_1_id,
  testUser_1,
  setupDB
};
