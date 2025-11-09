import express from "express";
import { adminOnly, verifyUser } from "../utils/verifyUser.js";
import createTask, { getTask, getTaskById, updateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/create-task", verifyUser,adminOnly, createTask);
router.get("/", verifyUser, getTask);
router.get("/:id", verifyUser, getTaskById);
router.put('/:id', verifyUser , updateTask)


export default router;
