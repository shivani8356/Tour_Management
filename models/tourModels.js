const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    name : 
    {
      type : String,
      // required : [true, "please enter user name"],
      trim : true
    },
   rating : 
    {
      type : Number
    },
    duration :
    {
      type : Number,
      // required : [true, "It must have duration"]
    },
    maxGroupSize : 
    {
      type : Number,
      // required : [true , "tour must have a group size"]
    },
    difficulty:
    {
      type : String,
      // required : [true , "enter difficulty"]
    },
    
    price :
    {
      type : Number,
      // required : [true, "enter price"]
    },
    summary : 
    {
      type : String,
      trim : true
    },
    description : 
    {
      type : String,
      trim : true,
      // required : [true , "must have description"]
    },
    imageCover : 
    {
      type : String,
      // require : [true , "must have image"] 
    },
    ratingsAverage : 
    {
      type : Number,
      default : 4.5
    },
    ratingsQuantity:
    {
      type : Number,
      default : 0
    },
    priceDiscount : Number,
    images : 
    {
      type : [String],
    },
    createdAt : 
    {
      type : Date,
      default : Date.now
    },
    startDates: 
    {
      type : [Date],

    }
  });
  const Tours = mongoose.model('Tours' , Schema)

  module.exports = Tours

