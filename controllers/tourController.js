const fs = require('fs')

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
exports.checkId = (req,res,next,val)=>{
    console.log(`the selected id is ${val}`)
    if (Number(req.params.id) > tours.length) {
        return res.status(404).json({
          status: 'failed',
          message: 'id not found',
        });
      }
    next();
}
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);
  console.log(tour);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(
      './dev-data/data/tours-simple.json',JSON.stringify(tours),()=>{
          res.status(201).json({
            status: 'success',
            message: 'Data posted',
            data: {
              tour: newTour
            },
          });
        }
      )};
      
  exports.deleteTour = (req, res) =>
    {
        res.status(204).json({
          status: 'success',
          message: 'data deleted',
          data: nullz,
        });
      }

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated string',
    },
  });
};
