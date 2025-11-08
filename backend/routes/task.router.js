import express from "express";
import { adminOnly, verifyUser } from "../utils/verifyUser.js";
import createTask, { getTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/create-task", verifyUser,adminOnly, createTask);
router.get("/", verifyUser, getTask)

export default router;
