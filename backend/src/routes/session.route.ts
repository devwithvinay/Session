import express from "express"
import { loggedIn } from "../middleware/auth.middleware.js"
import { cancelSession, completeSession, getSession, getSessionHistory, startSession } from "../controllers/session.controller.js"

const router = express.Router()

router.post("/start", loggedIn, startSession);
router.patch("/:sessionId/complete", loggedIn, completeSession);
router.patch("/:sessionId/cancel",loggedIn , cancelSession)
//patch existing resource ko partially update karna
router.get("/",loggedIn,getSession)
router.get("/history",loggedIn,getSessionHistory)


export default router;

