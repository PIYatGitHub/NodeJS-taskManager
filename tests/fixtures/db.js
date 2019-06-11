const mongoose= require ('mongoose'),
      jwt = require ('jsonwebtoken'),
      User = require('../../src/models/user'),
      Task = require('../../src/models/task');


const testUser_1_id = new mongoose.Types.ObjectId(),
      testUser_1 = {
  _id: testUser_1_id,
  name:"I am a test user",
  email:"test@test.com",
  password:"SerbiaStrong",
  age: 28,
  tokens:[{
    token: jwt.sign({_id:testUser_1_id}, process.env.JWT_SECRET)
  }]
};

const testUser_2_id = new mongoose.Types.ObjectId(),
      testUser_2 = {
  _id: testUser_2_id,
  name:"Second test user",
  email:"test2@test.com",
  password:"SerbiaStrong",
  age: 45,
  tokens:[{
    token: jwt.sign({_id:testUser_2_id}, process.env.JWT_SECRET)
  }]
};

const task_1 = {
  _id:mongoose.Types.ObjectId(),
  description:"A test task # 1",
  complete: true,
  owner: testUser_1_id
};
const task_2 = {
  _id:mongoose.Types.ObjectId(),
  description:"A test task # 2",
  complete: true,
  owner: testUser_1_id
};
const task_3 = {
  _id:mongoose.Types.ObjectId(),
  description:"A test task # 3",
  complete: false,
  owner: testUser_1_id
};
const task_4 = {
  _id:mongoose.Types.ObjectId(),
  description:"A test task # 4",
  complete: false,
  owner: testUser_1_id
};
const task_5 = {
  _id:mongoose.Types.ObjectId(),
  description:"A test task # 5",
  complete: false,
  owner: testUser_2_id
};
const task_6 = {
  _id:mongoose.Types.ObjectId(),
  description:"A test task # 6",
  complete: true,
  owner: testUser_2_id
};

const setupDB = async ()=>{
  await User.deleteMany();
  await new User(testUser_1).save();
  await new User(testUser_2).save();
  await Task.deleteMany();
  await new Task(task_1).save();
  await new Task(task_2).save();
  await new Task(task_3).save();
  await new Task(task_4).save();
  await new Task(task_5).save();
  await new Task(task_6).save();
};

module.exports={
  testUser_1_id,  testUser_2_id,
  testUser_1,     testUser_2,
  task_1,         task_2,
  task_3,         task_4,
  task_5,         task_6,
  setupDB
};
