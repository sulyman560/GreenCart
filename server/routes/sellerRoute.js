import express from 'express'
import { isSellerAuth, SellerLogin, sellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middleware/authSeller.js';

const sellerRouter = express.Router();
sellerRouter.post('/login' , SellerLogin);
sellerRouter.get('/is-auth' , authSeller, isSellerAuth);
sellerRouter.get('/logout' , authSeller, sellerLogout);



export default sellerRouter