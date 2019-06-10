require('./db/mongoose');
const express = require('express');
const app =express();
const userRouter = require('./routers/user'),
  taskRouter = require('./routers/task');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
module.exports = app;