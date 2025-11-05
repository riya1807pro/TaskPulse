import express from 'express';
import { SignIn, signUp, updateUserProfile, uploadImage, userProfile } from '../controllers/auth.controllers.js';
import { verifyUser } from '../utils/verifyUser.js';
import uploads from '../utils/uploadImage.js';

const router = express.Router();

router.post("/signUp", signUp);

router.post("/signIn", SignIn);

router.post("/userProfile", verifyUser , userProfile);
router.get("/userProfile", verifyUser , userProfile);

router.put("/updateUserProfile", verifyUser , updateUserProfile);

router.post("/uploadImage", uploads.single("image"), uploadImage);

export default router;