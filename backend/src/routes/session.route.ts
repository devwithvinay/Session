import express from "express";

import { loggedIn } from "../middleware/auth.middleware.js";

import {
  cancelSession,
  completeSession,
  getSession,
  getSessionHistory,
  pauseSession,
  resumeSession,
  startSession,
} from "../controllers/session.controller.js";

const router = express.Router();

router.post("/start", loggedIn, startSession);

router.patch("/:sessionId/pause", loggedIn, pauseSession);

router.patch("/:sessionId/resume", loggedIn, resumeSession);

router.patch("/:sessionId/complete", loggedIn, completeSession);

router.patch("/:sessionId/cancel", loggedIn, cancelSession);

router.get("/", loggedIn, getSession);

router.get("/history", loggedIn, getSessionHistory);

export default router;
