const fs = require('fs');
const Tour = require('./../models/tourModels');
const { throws } = require('assert');

// const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
// exports.checkId = (req,res,next,val)=>{
//     console.log(`the selected id is ${val}`)
//     if (Number(req.params.id) > tours.length) {
//         return res.status(404).json({
//           status: 'failed',
//           message: 'id not found',
//         });
//       }
//     next();
// }

exports.aliasTopTours = (req,res,next)=>{
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,duration,price';
  next();
}
exports.getAllTours = async (req, res) => {
  //FILTERING
  const queryObj = { ...req.query };
  const excludedFields = ['sort', 'limit', 'page', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);
  // console.log(req.query);

  //ADVANCED FILTERING
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // console.log(JSON.parse(queryStr));

  let query = Tour.find(JSON.parse(queryStr));

  //SORTING
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query.sort(sortBy);
  }

  //FIELD LIMITING
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  //PAGINATION
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numTours = await Tour.countDocuments();
    if (skip >= numTours) throw new Error('This page doesnot exist');
  }

  //Execute query
  const tours = await query;
  // {difficulty : 'easy' , duration : {$gte : 5}}

  try {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  const tours = await Tour.findById(req.params.id);
  try {
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body);
  try {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  try {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

//Aggregation pipeline
exports.getTourStats = async (req,res)=>{
  try {
      const stats = await Tour.aggregate([
      {
        $match : {ratingsAverage : {$gte : 4.5} , difficulty : { $ne : 'easy'}}
      },
      { 
        $group : {
        _id : null,
        numTours : {$sum : 1},
        averagePrice : {$avg : '$price'},
        averageRating : {$avg : '$ratingsAverage'},
        minPrice : {$min : '$price'},
        maxPrice : {$max : '$price'}
      }
    }
    ])
    console.log(stats)
  res.status(200).json({
    status : 'success',
    data : {
      stats
    }
  })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
}

exports.getMonthlyPlan = async (req,res)=>{
  try {
    const year = req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind : '$startDates'
      },
      {
        $match : {
          startDates : {
            $gte : new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group : {
          _id : {$month : '$startDates'},
          numTourStarts : {$sum:1},
          tours : {$push : '$name'} 
        }
      },
      {
        $addFields : {month : '$_id'}
      },
      {
        $project : {_id : 0}
      }
    ]);
    res.status(200).json({
      status : 'success',
      data : {
        plan
      }
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
}
