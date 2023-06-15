const express = require('express')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')

const router = express.Router();
// router.param('id' , tourController.checkId)
router.route('/monthlyplan/:year').get(tourController.getMonthlyPlan)
router.route('/tourStats').get(tourController.getTourStats)
router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)
router.route('/').get(authController.protect , tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router