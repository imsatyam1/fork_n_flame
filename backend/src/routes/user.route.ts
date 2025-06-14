import express from 'express';
import {
  login,
  signUp,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
  updateProfile,
  resendEmailVerification
} from '../controller/user.controller'; // Add `.js` if using ESM in Node.js
import { catchAsync } from '../Middleware/catchAsync';

import { isAuthenticated } from '../Middleware/isAuthenticated';
import { upload } from '../Middleware/multer';

const router = express.Router();

router.route('/signup').post(catchAsync(signUp));
router.route('/login').post(catchAsync(login));
router.route('/verify-email').post(catchAsync(verifyEmail));
router.route('/logout').post(catchAsync(logout));
router.route('/forgot-password').post(catchAsync(forgotPassword));
router.route('/reset-password/:token').post(catchAsync(resetPassword));
router.route('/check-auth').get(catchAsync(isAuthenticated), catchAsync(checkAuth));
router.route('/update-profile').put(upload.single('profilePicture'),catchAsync(updateProfile));
router.route('/resend-otp').post(catchAsync(resendEmailVerification))

export default router;
