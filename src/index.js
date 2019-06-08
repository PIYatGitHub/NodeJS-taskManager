const express = require('express');
require('./db/mongoose');
const middleware = require('./middleware');

const app =express(),
      port = process.env.PORT||3000;

const userRouter = require('./routers/user'),
      taskRouter = require('./routers/task');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>console.log(`server is up on ${port}`));