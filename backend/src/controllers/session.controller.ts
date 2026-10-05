import type { NextFunction, Request, Response } from "express";

import FocusSession from "../model/FocusSession.js";

const DEFAULT_FOCUS_DURATION = 25 * 60;

const MIN_SESSION_DURATION = 5 * 60;

const MAX_SESSION_DURATION = 120 * 60;

type SessionMode = "focus" | "short" | "long";

/**
 * Normalize session mode.
 *
 * Legacy sessions may not have a mode.
 */
const getSessionMode = (value: unknown): SessionMode => {
  if (value === "short" || value === "long") {
    return value;
  }

  return "focus";
};

/**
 * Normalize and validate target duration.
 *
 * Minimum: 5 minutes
 * Maximum: 120 minutes
 */
const getTargetDuration = (value: unknown, mode: SessionMode): number => {
  const parsedDuration = Number(value);

  if (Number.isFinite(parsedDuration) && parsedDuration > 0) {
    return Math.min(
      MAX_SESSION_DURATION,
      Math.max(MIN_SESSION_DURATION, Math.floor(parsedDuration)),
    );
  }

  if (mode === "short") {
    return 5 * 60;
  }

  if (mode === "long") {
    return 15 * 60;
  }

  return DEFAULT_FOCUS_DURATION;
};

/**
 * Normalize legacy sessions.
 *
 * This also makes sure old/corrupted targetDuration
 * values cannot bypass the current duration limits.
 */
const normalizeSession = (session: {
  mode?: SessionMode;
  targetDuration?: number;
}) => {
  const mode = getSessionMode(session.mode);

  const targetDuration = getTargetDuration(session.targetDuration, mode);

  session.mode = mode;
  session.targetDuration = targetDuration;

  return {
    mode,
    targetDuration,
  };
};

/**
 * START SESSION
 */
export const startSession = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;

  try {
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const mode = getSessionMode(req.body?.mode);

    const targetDuration = getTargetDuration(req.body?.targetDuration, mode);

    /*
     * Check whether this user already has
     * an active or paused session.
     */
    const existingSession = await FocusSession.findOne({
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    }).sort({
      createdAt: -1,
    });

    if (existingSession) {
      /*
       * Normalize legacy session before using it.
       */
      const { targetDuration: normalizedTargetDuration } =
        normalizeSession(existingSession);

      let elapsedSeconds = Number(existingSession.duration || 0);

      /*
       * If currently active, calculate the
       * time spent since activeStartTime.
       */
      if (existingSession.status === "active") {
        const now = new Date();

        const activeSeconds = Math.floor(
          (now.getTime() - existingSession.activeStartTime.getTime()) / 1000,
        );

        elapsedSeconds += Math.max(0, activeSeconds);
      }

      /*
       * If the existing session has already
       * reached its target, automatically complete it.
       */
      if (elapsedSeconds >= normalizedTargetDuration) {
        existingSession.duration = normalizedTargetDuration;

        existingSession.endTime = new Date();

        existingSession.status = "completed";

        await existingSession.save();
      } else {
        /*
         * Save normalized legacy fields.
         */
        if (
          existingSession.isModified("mode") ||
          existingSession.isModified("targetDuration")
        ) {
          await existingSession.save();
        }

        return res.status(400).json({
          success: false,
          message: "User already has an active session",
          session: existingSession,
        });
      }
    }

    const now = new Date();

    const session = await FocusSession.create({
      user: userId,
      startTime: now,
      activeStartTime: now,
      mode,
      targetDuration,
      duration: 0,
      status: "active",
    });

    return res.status(200).json({
      success: true,
      message: "Session started",
      session,
    });
  } catch (error) {
    /*
     * Important:
     *
     * The unique partial index prevents concurrent
     * requests from creating multiple active sessions.
     *
     * If MongoDB rejects a duplicate active session,
     * send it to the global error handler.
     */
    next(error);
  }
};

/**
 * PAUSE SESSION
 */
export const pauseSession = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;
  const { sessionId } = req.params;

  try {
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session id is required",
      });
    }

    /*
     * IMPORTANT:
     *
     * sessionId AND userId are checked together.
     *
     * A user cannot pause another user's session.
     */
    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: "active",
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Active session not found",
      });
    }

    const { targetDuration } = normalizeSession(session);

    const now = new Date();

    const activeSeconds = Math.floor(
      (now.getTime() - session.activeStartTime.getTime()) / 1000,
    );

    session.duration += Math.max(0, activeSeconds);

    session.duration = Math.min(session.duration, targetDuration);

    session.pausedAt = now;

    /*
     * If the timer naturally reached its target
     * while the user was active, complete it.
     */
    if (session.duration >= targetDuration) {
      session.duration = targetDuration;
      session.endTime = now;
      session.status = "completed";
    } else {
      session.status = "paused";
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message:
        session.status === "completed" ? "Session completed" : "Session paused",
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * RESUME SESSION
 */
export const resumeSession = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;
  const { sessionId } = req.params;

  try {
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session id is required",
      });
    }

    /*
     * Ownership is checked here as well.
     */
    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: "paused",
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Paused session not found",
      });
    }

    const { targetDuration } = normalizeSession(session);

    /*
     * A paused session may already be complete.
     */
    if (Number(session.duration || 0) >= targetDuration) {
      session.duration = targetDuration;
      session.endTime = new Date();
      session.status = "completed";

      await session.save();

      return res.status(400).json({
        success: false,
        message: "Session duration is already complete",
        session,
      });
    }

    /*
     * Make sure there isn't another active
     * session for this user.
     *
     * Normally impossible because of the
     * database-level unique index.
     */
    const anotherActiveSession = await FocusSession.findOne({
      user: userId,
      status: "active",
      _id: {
        $ne: session._id,
      },
    });

    if (anotherActiveSession) {
      return res.status(400).json({
        success: false,
        message: "User already has an active session",
      });
    }

    session.activeStartTime = new Date();

    session.status = "active";

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Session resumed",
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * COMPLETE SESSION
 */
export const completeSession = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;
  const { sessionId } = req.params;

  try {
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session id is required",
      });
    }

    /*
     * Ownership + valid status.
     */
    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Active or paused session not found",
      });
    }

    const { targetDuration } = normalizeSession(session);

    const endTime = new Date();

    /*
     * If active, calculate the latest active period.
     */
    if (session.status === "active") {
      const activeSeconds = Math.floor(
        (endTime.getTime() - session.activeStartTime.getTime()) / 1000,
      );

      session.duration += Math.max(0, activeSeconds);
    }

    session.duration = Math.min(Number(session.duration || 0), targetDuration);

    session.endTime = endTime;

    session.status = "completed";

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Session completed",
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CANCEL SESSION
 */
export const cancelSession = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;
  const { sessionId } = req.params;

  try {
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session id is required",
      });
    }

    /*
     * Ownership + active/paused status.
     */
    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Active or paused session not found",
      });
    }

    const { targetDuration } = normalizeSession(session);

    const now = new Date();

    /*
     * Only active sessions accumulate time
     * between activeStartTime and cancellation.
     */
    if (session.status === "active") {
      const elapsedSeconds = Math.floor(
        (now.getTime() - session.activeStartTime.getTime()) / 1000,
      );

      session.duration += Math.max(0, elapsedSeconds);
    }

    session.duration = Math.min(Number(session.duration || 0), targetDuration);

    session.endTime = now;

    session.status = "cancelled";

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Session cancelled",
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET CURRENT SESSION
 */
export const getSession = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /*
     * Only this user's active/paused session
     * can ever be returned.
     */
    const session = await FocusSession.findOne({
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    }).sort({
      createdAt: -1,
    });

    /*
     * Normalize legacy session in memory.
     */
    if (session) {
      normalizeSession(session);
    }

    return res.status(200).json({
      success: true,
      message: "Fetching successfully",
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET SESSION HISTORY
 */
export const getSessionHistory = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requestedPage = Number(req.query.page);

    const requestedLimit = Number(req.query.limit);

    const page =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(100, Math.floor(requestedLimit))
        : 20;

    const skip = (page - 1) * limit;

    /*
     * IMPORTANT:
     *
     * History is filtered by userId.
     *
     * No user can retrieve another user's
     * session history.
     */
    const sessions = await FocusSession.find({
      user: userId,
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const totalSessions = await FocusSession.countDocuments({
      user: userId,
    });

    const totalPages = Math.ceil(totalSessions / limit);

    return res.status(200).json({
      success: true,
      message: "Session history fetched successfully",
      sessions,
      pagination: {
        page,
        limit,
        totalSessions,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};
