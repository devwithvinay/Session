import type { NextFunction, Request, Response } from "express";
import FocusSession from "../model/FocusSession.js";

const DEFAULT_FOCUS_DURATION = 25 * 60;
const MIN_SESSION_DURATION = 5 * 60;
const MAX_SESSION_DURATION = 120 * 60;

type SessionMode = "focus" | "short" | "long";

const getSessionMode = (value: unknown): SessionMode => {
  if (value === "short" || value === "long") {
    return value;
  }

  return "focus";
};

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

/*
 * Legacy session compatibility
 *
 * Old sessions may not have:
 * - mode
 * - targetDuration
 *
 * Before saving an old session, we fill those values.
 */
const normalizeSession = (session: {
  mode?: SessionMode;
  targetDuration?: number;
}) => {
  const mode = getSessionMode(session.mode);

  const targetDuration =
    Number(session.targetDuration) > 0
      ? Number(session.targetDuration)
      : mode === "short"
        ? 5 * 60
        : mode === "long"
          ? 15 * 60
          : DEFAULT_FOCUS_DURATION;

  session.mode = mode;
  session.targetDuration = targetDuration;

  return {
    mode,
    targetDuration,
  };
};

export const startSession = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id;

  try {
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const mode = getSessionMode(req.body?.mode);

    const targetDuration = getTargetDuration(req.body?.targetDuration, mode);

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
       * Normalize legacy sessions BEFORE saving.
       */
      const normalized = normalizeSession(existingSession);

      let elapsedSeconds = Number(existingSession.duration || 0);

      if (existingSession.status === "active") {
        const now = new Date();

        const activeSeconds = Math.floor(
          (now.getTime() - existingSession.activeStartTime.getTime()) / 1000,
        );

        elapsedSeconds += Math.max(0, activeSeconds);
      }

      if (elapsedSeconds >= normalized.targetDuration) {
        existingSession.duration = normalized.targetDuration;

        existingSession.endTime = new Date();
        existingSession.status = "completed";

        await existingSession.save();
      } else {
        /*
         * Save the normalized legacy fields even
         * when the session is still active.
         */
        if (
          existingSession.isModified("mode") ||
          existingSession.isModified("targetDuration")
        ) {
          await existingSession.save();
        }

        return res.status(400).json({
          message: "User already has an active session",
          success: false,
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
      message: "Session started",
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

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
        message: "Unauthorized",
        success: false,
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        message: "Session id is required",
        success: false,
      });
    }

    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: "active",
    });

    if (!session) {
      return res.status(400).json({
        message: "Active session not found",
        success: false,
      });
    }

    /*
     * Fix legacy sessions before saving.
     */
    const { targetDuration } = normalizeSession(session);

    const now = new Date();

    const activeSeconds = Math.floor(
      (now.getTime() - session.activeStartTime.getTime()) / 1000,
    );

    session.duration += Math.max(0, activeSeconds);

    session.duration = Math.min(session.duration, targetDuration);

    session.pausedAt = now;
    session.status = "paused";

    await session.save();

    return res.status(200).json({
      message: "Session paused",
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

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
        message: "Unauthorized",
        success: false,
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        message: "Session id is required",
        success: false,
      });
    }

    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: "paused",
    });

    if (!session) {
      return res.status(400).json({
        message: "Paused session not found",
        success: false,
      });
    }

    /*
     * Fix legacy sessions before saving.
     */
    const { targetDuration } = normalizeSession(session);

    if (Number(session.duration || 0) >= targetDuration) {
      session.duration = targetDuration;
      session.endTime = new Date();
      session.status = "completed";

      await session.save();

      return res.status(400).json({
        message: "Session duration is already complete",
        success: false,
        session,
      });
    }

    session.activeStartTime = new Date();
    session.status = "active";

    await session.save();

    return res.status(200).json({
      message: "Session resumed",
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

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
        message: "Unauthorized",
        success: false,
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        message: "Session id is required",
        success: false,
      });
    }

    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    });

    if (!session) {
      return res.status(400).json({
        message: "Active or paused session not found",
        success: false,
      });
    }

    /*
     * Fix legacy sessions before saving.
     */
    const { targetDuration } = normalizeSession(session);

    const endTime = new Date();

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
      message: "Session completed",
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

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
        message: "Unauthorized",
        success: false,
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        message: "Session id is required",
        success: false,
      });
    }

    const session = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    });

    if (!session) {
      return res.status(404).json({
        message: "Active or paused session not found",
        success: false,
      });
    }

    /*
     * Fix legacy sessions before saving.
     */
    const { targetDuration } = normalizeSession(session);

    const now = new Date();

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
      message: "Session cancelled",
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const getSession = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const session = await FocusSession.findOne({
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    }).sort({
      createdAt: -1,
    });

    /*
     * If a legacy active/paused session exists,
     * normalize it in memory so the frontend receives
     * the required values.
     */
    if (session) {
      normalizeSession(session);
    }

    return res.status(200).json({
      message: "Fetching successfully",
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionHistory = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);

    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const skip = (page - 1) * limit;

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
      message: "Session history fetched successfully",
      success: true,
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
