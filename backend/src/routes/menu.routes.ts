import express from 'express'
import { upload } from '../Middleware/multer'
import { isAuthenticated } from '../Middleware/isAuthenticated'
import { addMenu, editMenu, getAllMenus } from '../controller/menu.controller'
import { catchAsync } from '../Middleware/catchAsync';

const router = express.Router();

router.route("/").post(catchAsync(isAuthenticated), upload.single("image"), catchAsync(addMenu));
router.route("/:id").put(catchAsync(isAuthenticated), upload.single("image"), catchAsync(editMenu));
router.route("/").get(catchAsync(getAllMenus));

export default router;