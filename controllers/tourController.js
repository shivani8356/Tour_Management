const fs = require('fs');
const Tour = require('./../models/tourModels');

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
exports.getAllTours = async (req, res) => {
  const tours = await Tour.find();
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
      status : "fail",
      message : error
    })
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
      status : "fail",
      message : error
    })
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

exports.updateTour =async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id , req.body);
  try {
    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
  } catch (error) {
    res.status(404).json({
      status : "fail",
      message : error
    })
  } 
};

exports.deleteTour =  async (req, res) => {
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
      status : "fail",
      message : error
    })
  } 
};