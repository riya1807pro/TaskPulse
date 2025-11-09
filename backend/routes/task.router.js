import express from "express";
import { adminOnly, verifyUser } from "../utils/verifyUser.js";
import createTask, { getTask, getTaskById } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/create-task", verifyUser,adminOnly, createTask);
router.get("/", verifyUser, getTask);
router.get("/:id", verifyUser, getTaskById);

export default router;
