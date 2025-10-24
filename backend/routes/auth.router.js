import express from 'express';
import { SignIn, signUp, userProfile } from '../controllers/auth.controolers.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/signUp", signUp);

router.post("/signIn", SignIn);

router.post("/userProfile", verifyUser , userProfile);
router.get("/userProfile", verifyUser , userProfile);

export default router;