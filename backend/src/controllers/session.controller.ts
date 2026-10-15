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

    const existingSession = await FocusSession.findOne({
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    }).sort({
      createdAt: -1,
    });

    if (existingSession) {
      const { targetDuration: normalizedTargetDuration } =
        normalizeSession(existingSession);

      let elapsedSeconds = Number(existingSession.duration || 0);

      if (existingSession.status === "active") {
        const now = new Date();

        const activeSeconds = Math.floor(
          (now.getTime() - existingSession.activeStartTime.getTime()) / 1000,
        );

        elapsedSeconds += Math.max(0, activeSeconds);
      }

      if (elapsedSeconds >= normalizedTargetDuration) {
        existingSession.duration = normalizedTargetDuration;

        existingSession.endTime = new Date();

        existingSession.status = "completed";

        await existingSession.save();
      } else {
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

    const session = await FocusSession.findOne({
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    }).sort({
      createdAt: -1,
    });

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
