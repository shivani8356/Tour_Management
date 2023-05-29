const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')
dotenv.config({path : './config.env'})

const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(con =>{
  console.log(con.connections);
  console.log("DB connection is successful")
});

console.log(app.get('env'))

app.listen(process.env.PORT, () => {
    console.log(`listening on this ${process.env.PORT}`);
  });
  console.log(process.env);
  