import express from 'express';
import { SignIn, signUp, updateUserProfile, userProfile } from '../controllers/auth.controllers.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signUp", signUp);

router.post("/signIn", SignIn);

router.post("/userProfile", verifyUser , userProfile);
router.get("/userProfile", verifyUser , userProfile);

router.put("/updateUserProfile", verifyUser , updateUserProfile);
export default router;