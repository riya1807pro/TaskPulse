import express from "express"
import { adminOnly, verifyUser } from "../utils/verifyUser.js";
import { getUser, getUserById } from "../controllers/users.controller.js";
import { updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.get('/get-users', verifyUser , adminOnly, getUser)
router.get('/:id', verifyUser , getUserById)

export default router;