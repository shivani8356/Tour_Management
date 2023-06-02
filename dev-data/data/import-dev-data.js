const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModels')

dotenv.config({path : './config.env'})

const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(()=>{console.log("DB connection is successful")}); 
 
     //Read json file
  const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json' , 'utf-8'))
  const importData = async ()=>{
    try {
        await Tour.create(tours)
        console.log("data successfully loaded")
    } catch (error) {
        console.log(error)
    }
  }

    //Delete all data from collection
    const deleteData = async ()=>{
        try {
            await Tour.deleteMany()
            // console.log("data successfully loaded")
        } catch (error) {
            console.log(error)
        }
      }
    if(process.argv[2] == '--import'){
        importData();
    }
    else if(process.argv[2] == '--export'){
        deleteData();
    }
    console.log(process.argv)
 
