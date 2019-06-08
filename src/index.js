const express = require('express');
require('./db/mongoose');
const middleware = require('./middleware');

const app =express(),
      port = process.env.PORT||3000;

const userRouter = require('./routers/user'),
      Task = require('./models/task');

app.use(express.json());
app.use(userRouter);


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

app.patch('/tasks/:id', async (req, res)=>{
  const allowedUpdates = ['description', 'completed'];
  if (!middleware.validateUpdate(req.body, allowedUpdates)){
    return res.status(400).send({error:'Invalid updates!'});
  }

  try{
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true});
    if(!task) return res.status(404).send();
    res.send(task)
  }catch (e) {
    res.status(400).send(e)
  }
});

app.delete('/tasks/:id', async (req, res)=>{
  try{
    const task = await Task.findByIdAndDelete(req.params.id);
    if(!task) return res.status(404).send();
    res.send(task)
  }catch (e) {
    res.status(500).send(e)
  }
});

app.listen(port,()=>console.log(`server is up on ${port}`));