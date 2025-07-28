import express from 'express'
import authUser from '../middleware/authUser.js';
import { getAllOrders, getUsersOrders, placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js';
import authSeller from '../middleware/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod' , authUser, placeOrderCOD );
orderRouter.get('/user' , authUser, getUsersOrders );
orderRouter.get('/seller' , authSeller, getAllOrders );
orderRouter.post('/stripe' , authUser, placeOrderStripe );




export default orderRouter;