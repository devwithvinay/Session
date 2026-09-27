import express from "express"

import { getAnalytics } from "../controllers/analytics.controller.js"
import { loggedIn } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/" ,loggedIn, getAnalytics)

export default router