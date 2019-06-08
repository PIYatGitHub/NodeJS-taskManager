const mongoose = require('mongoose'),
      validator = require('validator'),
      bcrypt=require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true
  },
  email:{
    type:String,
    trim:true,
    lowercase:true,
    required:true,
    validate(value){
      if(!validator.isEmail(value)) throw new Error('Invalid email...')
    }
  },
  password:{
    type:String,
    trim:true,
    required:true,
    validate(value){
      if(value.length<6) throw new Error('Invalid password. At least 6 characters are required.');
      if (value.toLowerCase().includes('password')) throw new Error('Blacklisted password that is!');
    }
  },
  age:{
    type:Number,
    default:13,
    min:13,
    max:130
  }
});
userSchema.pre('save', async function (next) {
  const user = this;
  console.log('in here???');
  if (user.isModified('password')) user.password = await bcrypt.hash(user.password,8);
  next();
});
const User = mongoose.model('User',userSchema);
module.exports = User;