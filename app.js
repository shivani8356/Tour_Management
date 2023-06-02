const express = require('express');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();
app.use(express.json());
app.use(express.static('./public'))

// app.use((req,res,next)=>{
//   console.log("Hey there ☺ ")
//   next();
// })

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

