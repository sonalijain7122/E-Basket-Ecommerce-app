import express from 'express';
import {registerController , loginController,testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../controller/authController.js'
import { requireSignIn,isAdmin } from '../middlewares/authmiddleware.js';

// router object
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post('/register',registerController);

// login || post
router.post('/login',loginController);

// forgot-password || post
router.post('/forgot-password',forgotPasswordController);

//test routes
router.get('/test',requireSignIn,isAdmin,testController);

//protected user routes
router.get('/user-auth',requireSignIn , (req,res)=>{
    res.status(200).send({ok:true});
});


//protected admin routes
router.get('/admin-auth',requireSignIn ,isAdmin, (req,res)=>{
    res.status(200).send({ok:true});
});


// updated profile
router.put('/profile',requireSignIn,updateProfileController);

//orders
router.get('/orders',requireSignIn,getOrdersController);

// All orders
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController);

// order status update
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController);


export default router
