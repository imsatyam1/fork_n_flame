import express from 'express'
import { isAuthenticated } from '../Middleware/isAuthenticated';
import { createCheckoutSession, getOrder } from '../controller/order.controller';
import { catchAsync } from '../Middleware/catchAsync';

const router = express.Router();

router.route("/").get(catchAsync(isAuthenticated), catchAsync(getOrder));
router.route("/checkout/create-checkout-session").post(catchAsync(isAuthenticated), catchAsync(createCheckoutSession))

export default router;

