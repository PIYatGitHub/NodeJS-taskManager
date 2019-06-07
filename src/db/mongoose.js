const mongoose = require('mongoose'),
      validator = require('validator');
const connectionURL = 'mongodb://127.0.0.1:27017/taskManager',
      dbOptions= {useNewUrlParser:true, useCreateIndex:true};
mongoose.connect(connectionURL, dbOptions);

const User = mongoose.model('User',{
    name:{
      type:String
    },
    email:{
      type:String,
      required:true,
      validate(value){
        if(!validator.isEmail(value)) throw new Error('Invalid email...')
      }
    },
    age:{
      type:Number,
      required:true,
      validate(value){
        if(value<13) throw new Error('Get back to the analogue world, will you!');
        if(value>130) throw new Error('You seem too old to have a PC. Enter some realistic age...!');
      }
    }
});

const Task = mongoose.model('Task',{
  description:{
    type:String,
    required:true,
    default:"Untitled task"
  },
  complete:{
    type:Boolean,
    required:true,
    default: false
  }
});

const me = new User({
  name:"Petar Iv. Yonkov",
  age: 108,
  email:'me@1.com'
});
me.save().then(()=>console.log('did it go in -- yes!')).catch((err)=>{console.log(err)});

// const task2 = new Task({
//   complete: true
// });
// task2.save().then(()=>console.log('did it go in -- yes!')).catch((err)=>{console.log(err)});
