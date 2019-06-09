const jwt = require('jsonwebtoken'),
      User = require('../models/user'),
      utils = require('../utils/config');

const validateUpdate = (updatesObj, allowedUpdates)=>{
   return Object.keys(updatesObj).every((update)=>allowedUpdates.includes(update));
};
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''),
          decoded = jwt.verify(token, utils.secret),
          user = await User.findOne({_id:decoded._id, 'tokens.token':token});
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  }catch (e) {
    res.status(401).send({error:'Please authenticate!'})
  }
};
module.exports = {
  validateUpdate,auth
};