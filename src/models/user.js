const mongoose = require('mongoose'),
      validator = require('validator'),
      bcrypt=require('bcryptjs'),
      jwt = require('jsonwebtoken'),
      Task = require('./task');

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
  },
  tokens: [{
    token:{
      type:String,
      required:true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps:true
});

userSchema.virtual('tasks', {
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
});

userSchema.methods.generateAuthToken = async function () {
  const user = this,
        token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET, {expiresIn:'4 hours'});
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this,
        publicUser=user.toObject();
  delete publicUser.password;
  delete publicUser.tokens;
  delete publicUser.avatar;
  return publicUser;
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

userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({owner:user._id});
  next();
});

const User = mongoose.model('User',userSchema);
module.exports = User;