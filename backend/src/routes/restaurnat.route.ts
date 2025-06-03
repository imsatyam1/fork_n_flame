import express from 'express';
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  getRestaurantOrder,
  updateOrderStatus,
  searchRestaurant,
  getSingleRestaurant,
  getAllRestaurant
} from '../controller/restaurant.controller';
import { upload } from '../Middleware/multer';
import { isAuthenticated } from '../Middleware/isAuthenticated';
import { catchAsync } from '../Middleware/catchAsync';

const router = express.Router();

// Restaurant CRUD
router.post("/", catchAsync(isAuthenticated), upload.single("imageFile"), catchAsync(createRestaurant));
router.get("/", catchAsync(isAuthenticated), catchAsync(getRestaurant));
router.put("/", catchAsync(isAuthenticated), upload.single("imageFile"), catchAsync(updateRestaurant));

// Orders
router.get("/order", catchAsync(isAuthenticated), catchAsync(getRestaurantOrder));
router.put("/order/:orderId/status", catchAsync(isAuthenticated), catchAsync(updateOrderStatus));

// Search
router.get("/search/:searchText", catchAsync(isAuthenticated), catchAsync(searchRestaurant));

// Get single restaurant (this should be last)
router.get("/get-restaurants", catchAsync(isAuthenticated), catchAsync(getAllRestaurant));

router.get("/:id", catchAsync(isAuthenticated), catchAsync(getSingleRestaurant));

export default router;
