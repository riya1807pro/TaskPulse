import express from 'express';
import { SignIn, signUp } from '../controllers/auth.controolers.js';

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", SignIn);

export default router;