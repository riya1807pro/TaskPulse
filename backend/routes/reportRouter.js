import express from "express";
import { verifyUser, adminOnly } from "../utils/verifyUser.js"
import { exportTaskReport, exportUsersReport } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/export/task", verifyUser, adminOnly, exportTaskReport)
router.get("/export/user", verifyUser, adminOnly, exportUsersReport)

export default router;