const express = require('express'),
  middleware = require('../middleware'),
  Task = require('../models/task'),
  router = new express.Router();

router.get('/tasks', async (req, res)=>{
  try {
    const tasks = await Task.find({});
    res.send(tasks)
  }catch (e) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', async (req, res)=>{
  try {
    const task = await Task.findById({_id:req.params.id});
    if (!task)  return res.status(404).send();
    res.send(task);
  }catch (e) {
    res.status(500).send();
  }
});

router.post('/tasks', async (req, res)=>{
  const task = new Task(req.body);
  try{
    await task.save();
    res.status(201).send(task)
  }catch (e) {
    res.status(400).send(e)
  }
});

router.patch('/tasks/:id', async (req, res)=>{
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

router.delete('/tasks/:id', async (req, res)=>{
  try{
    const task = await Task.findByIdAndDelete(req.params.id);
    if(!task) return res.status(404).send();
    res.send(task)
  }catch (e) {
    res.status(500).send(e)
  }
});

module.exports = router;