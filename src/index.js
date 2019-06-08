const express = require('express');
require('./db/mongoose');

const app =express(),
      port = process.env.PORT||3000;

const User = require('./models/user'),
      Task = require('./models/task');

app.use(express.json());

app.get('/users', async (req, res)=>{
  try {
    const users = await User.find({});
    res.send(users)
  }catch (e) {
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res)=>{
  try {
    const user = await User.findById({_id:req.params.id});
    if (!user) return res.status(404).send();
    res.send(user);
  }catch (e) {
    res.status(500).send();
  }
});

app.post('/users', async (req, res)=>{
  const user = new User(req.body);
  try{
    await user.save();
    res.status(201).send(user)
  }catch (e) {
    res.status(400).send(e)
  }
});

app.patch('/users/:id', async (req, res)=>{
  const updates = Object.keys(req.body),
        allowedUpdates = ['name', 'age', 'email', 'password'],
        isValidUpd = updates.every((update)=>allowedUpdates.includes(update));
  if (!isValidUpd) return res.status(400).send({error:'Invalid updates!'});
  
  try{
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true});
    if(!user) return res.status(404).send();
    res.send(user)
  }catch (e) {
    res.status(400).send(e)
  }
});

app.get('/tasks', async (req, res)=>{
  try {
    const tasks = await Task.find({});
    res.send(tasks)
  }catch (e) {
    res.status(500).send();
  }
});

app.get('/tasks/:id', async (req, res)=>{
  try {
    const task = await Task.findById({_id:req.params.id});
    if (!task)  return res.status(404).send();
    res.send(task);
  }catch (e) {
    res.status(500).send();
  }
});

app.post('/tasks', async (req, res)=>{
  const task = new Task(req.body);
  try{
    await task.save();
    res.status(201).send(task)
  }catch (e) {
    res.status(400).send(e)
  }
});

app.listen(port,()=>console.log(`server is up on ${port}`));