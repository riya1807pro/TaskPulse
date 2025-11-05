import express from "express";
import { adminOnly, verifyUser } from "../utils/verifyUser.js";
import createTask from "../controllers/task.controller.js";

const router = express.Router();
router.post("/create-task", verifyUser,adminOnly, createTask);
export default router;
