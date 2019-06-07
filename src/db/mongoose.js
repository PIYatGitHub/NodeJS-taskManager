const mongoose = require('mongoose'),
      connectionURL = 'mongodb://127.0.0.1:27017/taskManager',
      dbOptions= {useNewUrlParser:true, useCreateIndex:true};
mongoose.connect(connectionURL, dbOptions);

const User = mongoose.model('User',{
    name:{
      type:String
    },
    age:{
      type:Number,
      required:true
    }
});
const me = new User({
  name:"Petar Iv. Yonkov",
  age: 27
});
me.save().then(()=>console.log('did it go in -- yes!')).catch((err)=>{console.log(err)});
