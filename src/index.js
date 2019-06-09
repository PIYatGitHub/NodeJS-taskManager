require('./db/mongoose');
const express = require('express');
const app =express(), port = process.env.PORT;
const userRouter = require('./routers/user'),
      taskRouter = require('./routers/task');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(port,()=>console.log(`server is up on ${port}`));