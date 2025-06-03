import express from 'express'
import { isAuthenticated } from '../Middleware/isAuthenticated';
import { createCheckoutSession, getOrder, stripeWebhook } from '../controller/order.controller';
import { catchAsync } from '../Middleware/catchAsync';

const router = express.Router();

router.route("/").get(catchAsync(isAuthenticated), catchAsync(getOrder));
router.route("/checkout/create-checkout-session").post(catchAsync(isAuthenticated), catchAsync(createCheckoutSession))
router.route("/webhook").post(express.raw({type: 'application/json'}), catchAsync(stripeWebhook));

export default router;

