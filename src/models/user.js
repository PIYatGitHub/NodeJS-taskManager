const mongoose = require('mongoose'),
      validator = require('validator'),
      bcrypt=require('bcryptjs'),
      jwt = require('jsonwebtoken'),
      config = require('../utils/config');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true
  },
  email:{
    type:String,
    unique: true,
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

userSchema.methods.generateAuthToken = async function () {
  return jwt.sign({_id:this._id.toString()},config.secret, {expiresIn:'8 hours'});
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email});
  const isMatch = await bcrypt.compare(password,user.password);
  if (!user)    throw new Error('Unable to log in!');
  if (!isMatch) throw new Error('Unable to log in!');
  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) user.password = await bcrypt.hash(user.password,8);
  next();
});
const User = mongoose.model('User',userSchema);
module.exports = User;