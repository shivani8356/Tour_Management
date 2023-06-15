const express = require('express')
const userRouter = require('./../controllers/userController')
const authRouter = require('./../controllers/authController')


const router = express.Router();

router.post('/signup' , authRouter.signup)
router.post('/login' , authRouter.login)

router.post('/forgotPassword' , authRouter.forgotPassword)
router.patch('/resetPassword/:token' , authRouter.resetPassword)

router.patch('/updatePassword' , authRouter.protect , authRouter.updatePassword)

router.route('/').get(userRouter.getAllUsers).post(userRouter.createUser);
router.route('/:id').get(userRouter.getUser).patch(userRouter.updateUser);

module.exports = router;