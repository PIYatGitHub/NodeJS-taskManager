const mongoose = require('mongoose'),
  validator = require('validator');

const User = mongoose.model('User',{
  name:{
    type:String,
    trim:true,
    default: "Anonymous"
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
    default:14,
    validate(value){
      if(value<13) throw new Error('Get back to the analogue world, will you!');
      if(value>130) throw new Error('You seem too old to have a PC. Enter some realistic age...!');
    }
  }
});

module.exports = User;