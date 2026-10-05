import express from "express";
import {
  getAnalytics,
  getDailyFocus,
  getSessionHistory,
} from "../controllers/analytics.controller.js";
import { loggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", loggedIn, getAnalytics);
router.get("/daily", loggedIn, getDailyFocus);
router.get("/history", loggedIn, getSessionHistory);

export default router;
