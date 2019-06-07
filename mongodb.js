const mongo = require('mongodb'),
      MongoClient = mongo.MongoClient;
const connectionUrl = 'mongodb://127.0.0.1:27017',
      dbName = 'taskManager';

MongoClient.connect(connectionUrl,{useNewUrlParser:true}, (error, client)=>{
  if (error) return console.log('unable to connect to the db');
  console.log(`Connected to the following db: ${dbName} @ address ${connectionUrl}`);
  const db = client.db(dbName);
  // db.collection('users').insertOne({username:'PIY', name:'Peter Yonkov'},(err, res)=>{
  //   if (error) return console.log('unable to add a user to the db :(((');
  //   console.log(res.ops);
  // });
  const usersToAdd = [
    {username:'Andrea', name:'what'},
    {username:'Jen', name:'ever'},
    {username:'Pepe', name:'it takes'},
    {username:'Joe', name:'to be a happy camper'}
  ];
  db.collection('users').insertMany(usersToAdd,(error, res)=>{
      if (error) return console.log('unable to add a user to the db :(((');
      console.log(res.ops);
  });

});