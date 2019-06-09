const express = require('express'),
  middleware = require('../utils/middleware'),
  Task = require('../models/task'),
  router = new express.Router();

router.get('/tasks', middleware.auth, async (req, res)=>{
  try {
   await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks)
  }catch (e) {
    res.status(500).send();
  }
});

router.get('/tasks/:id',middleware.auth, async (req, res)=>{
  try {
    const task = await Task.findOne({_id:req.params.id, owner:req.user._id});
    if (!task)  return res.status(404).send();
    res.send(task);
  }catch (e) {
    res.status(500).send();
  }
});

router.post('/tasks', middleware.auth,async (req, res)=>{
  const task = new Task({...req.body, owner:req.user._id});
  try{
    await task.save();
    res.status(201).send(task)
  }catch (e) {
    res.status(400).send(e)
  }
});

router.patch('/tasks/:id',middleware.auth, async (req, res)=>{
  const allowedUpdates = ['description', 'complete'];
  if (!middleware.validateUpdate(req.body, allowedUpdates)){
    return res.status(400).send({error:'Invalid updates!'});
  }

  try{
    const task = await Task.findOne({_id: req.params.id, owner:req.user._id});
    if(!task) return res.status(404).send();
    Object.keys(req.body).forEach((update)=>task[update] = req.body[update]);
    await task.save();
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