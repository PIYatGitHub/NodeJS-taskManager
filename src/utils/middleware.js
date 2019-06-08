const validateUpdate = (updatesObj, allowedUpdates)=>{
   return Object.keys(updatesObj).every((update)=>allowedUpdates.includes(update));
};
module.exports = {
  validateUpdate
};