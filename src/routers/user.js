const express = require('express'),
      middleware = require('../utils/middleware'),
      User = require('../models/user'),
      router = new express.Router();

router.get('/users/me',middleware.auth, async (req, res)=>{
  res.send(req.user);
});

router.get('/users/:id', async (req, res)=>{
  try {
    const user = await User.findById({_id:req.params.id});
    if (!user) return res.status(404).send();
    res.send(user);
  }catch (e) {
    res.status(500).send();
  }
});

router.post('/users', async (req, res)=>{
  const user = new User(req.body);
  try{
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token})
  }catch (e) {
    res.status(400).send(e)
  }
});

router.post('/users/login', async (req, res)=>{
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password),
          token = await user.generateAuthToken();
    res.send({user, token});
  }catch (e) {
    res.status(401).send(e)
  }
});

router.patch('/users/:id', async (req, res)=>{
  const allowedUpdates = ['name', 'age', 'email', 'password'];
  if (!middleware.validateUpdate(req.body, allowedUpdates)){
    return res.status(400).send({error:'Invalid updates!'});
  }

  try{
    const user = await User.findById(req.params.id);
    Object.keys(req.body).forEach((update)=>user[update] = req.body[update]);
    await user.save();

    if(!user) return res.status(404).send();
    res.send(user)
  }catch (e) {
    res.status(400).send(e)
  }
});

router.delete('/users/:id', async (req, res)=>{
  try{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).send();
    res.send(user)
  }catch (e) {
    res.status(500).send(e)
  }
});
module.exports = router;
