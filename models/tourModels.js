const { kMaxLength } = require('buffer');
const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema({
    name : 
    {
      type : String,
      // required : [true, "please enter user name"],
      trim : true,
      maxLength : [40 , "name must be less than or equal to 40 chars"],
      minLength : [ 5, "name must be greater than or equal to 5 chars"],
      validator : [validator.isAlpha , "tour name must only contain chars"]
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
      enum : {
        values : ["easy", "medium" , "difficult"],
        message : ["difficulty is either easy , medium or difficult"]
      }
    },
    
    price :
    {
      type : Number,
      required : [true, "enter price"],
      validate : {
        validator : function(val){
          return val<this.price;
        },
        message : "discount price ({VALUE}) must be less than actual price"
      }
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
      default : 4.5,
      min : [1 , "rating must be above or equal to 1.0"],
      max : [5 , "rating must be below or equal to 5.0"]
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

    },
    secretTours :
    {
      type : Boolean,
      default : false
    }
  },{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
  }
  );

  Schema.virtual('durationWeek').get(function (){
    return this.duration/7;
  });

  //Document middleware - runs before .save and .create
  Schema.pre('save' , function(next){
    // console.log(this);
    next();
  })

  Schema.post('save' , function(docs,next){
    // console.log(docs);
    next();
  })

  //QUERY MIDDLEWARE
  Schema.pre(/^find/ , function(next){
    // console.log(this);
    this.find({secretTours : {$ne : true}})
    this.start = Date.now()
    next();
  })

  Schema.post(/^find/ , function(docs,next){
    console.log(`this query took ${Date.now() - this.start} milliseconds`);
    // console.log(docs)
    next();
  })


  const Tours = mongoose.model('Tours' , Schema)

  module.exports = Tours

