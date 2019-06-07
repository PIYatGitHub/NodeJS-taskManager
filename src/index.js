const express = require('express');
const app =express(),
      port = process.env.PORT||3000;

app.use(express.json());

app.post('/users', (req, res)=>{
  console.log('data?', req.body);
  res.send('testing - OK!');
});

app.listen(port,()=>console.log(`server is up on ${port}`));