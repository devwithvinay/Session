import express from "express"

import { getAnalytics, getDailyFocus } from "../controllers/analytics.controller.js"
import { loggedIn } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/" ,loggedIn, getAnalytics)
router.get("/daily", loggedIn, getDailyFocus)

export default router