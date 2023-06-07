const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')
dotenv.config({path : './config.env'})

console.log(app.get('env'));

const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(()=>{console.log("DB connection is successful")}); 
 
app.listen(process.env.PORT, () => {
    console.log(`listening on this ${process.env.PORT}`);
  });


  