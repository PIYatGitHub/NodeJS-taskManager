const mongo = require('mongodb'),
      MongoClient = mongo.MongoClient;
const connectionUrl = 'mongodb://127.0.0.1:27017',
      dbName = 'taskManager';

MongoClient.connect(connectionUrl,{useNewUrlParser:true}, (error, client)=>{
  if (error) return console.log('unable to connect to the db');
  console.log(`Connected to the following db: ${dbName} @ address ${connectionUrl}`);
  const db = client.db(dbName);

  db.collection('users').findOne({username:'PIY'}, (err, res) =>{
    if (err) return console.log('unable to get the user you wanted...');
    console.log(res);
  });

});