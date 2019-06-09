const express = require('express'),
      multer = require('multer'),
      middleware = require('../utils/middleware'),
      User = require('../models/user'),
      router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb){
    const fileExtension =file.originalname.toLowerCase();
    if (fileExtension.match(/\.(jpg|png|jpeg)$/)) return cb(undefined,true);
    cb(new Error('File must be an image!'));
  }
});

router.get('/users/me',middleware.auth, async (req, res)=>{
 try {
   res.send(req.user);
 }catch (e) {
   res.status(400).send();
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

router.post('/users/logout', middleware.auth, async (req, res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((t)=>t.token!==req.token);
    await req.user.save();
    res.send();
  }catch (e) {
    res.status(500).send()
  }
});

router.post('/users/logoutAll', middleware.auth, async (req, res)=>{
  try{
    req.user.tokens = [];
    await req.user.save();
    res.send();
  }catch (e) {
    res.status(500).send()
  }
});

router.post('/users/me/avatar', middleware.auth,upload.single('profile_image'),async (req, res)=>{
  req.user.avatar = req.file.buffer;
  await req.user.save();
  res.status(201).send();
},(error, req, res, next)=>{
  res.status(400).send({error: error.message});
});

router.patch('/users/me', middleware.auth, async (req, res)=>{
  const allowedUpdates = ['name', 'age', 'email', 'password'];
  if (!middleware.validateUpdate(req.body, allowedUpdates)){
    return res.status(400).send({error:'Invalid updates!'});
  }

  try{
    Object.keys(req.body).forEach((update)=>req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  }catch (e) {
    res.status(400).send(e)
  }
});

router.delete('/users/me', middleware.auth, async (req, res)=>{
  try{
    await req.user.remove();
    res.send(req.user)
  }catch (e) {
    res.status(500).send(e)
  }
});

router.delete('/users/me/avatar', middleware.auth, async (req, res)=>{
  try{
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
  }catch (e) {
    res.status(500).send(e)
  }
});

module.exports = router;
