import type { NextFunction, Request, Response } from "express";

import FocusSession from "../model/FocusSession.js";

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

    // User cannot start another session
    // while one is active or paused.
    const existingSession = await FocusSession.findOne({
      user: userId,
      status: {
        $in: ["active", "paused"],
      },
    });

    if (existingSession) {
      return res.status(400).json({
        message: "User already has an active session",
        success: false,
        session: existingSession,
      });
    }

    const now = new Date();

    const session = await FocusSession.create({
      user: userId,
      startTime: now,
      activeStartTime: now,
      duration: 0,
      status: "active",
    });

    return res.status(200).json({
      message: "Focus session started",
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

    const now = new Date();

    // Add current active period to total duration
    const activeSeconds = Math.floor(
      (now.getTime() - session.activeStartTime.getTime()) / 1000,
    );

    session.duration += activeSeconds;

    session.pausedAt = now;
    session.status = "paused";

    await session.save();

    return res.status(200).json({
      message: "Focus session paused",
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

    const now = new Date();

    session.activeStartTime = now;
    session.status = "active";

    await session.save();

    return res.status(200).json({
      message: "Focus session resumed",
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

    const endTime = new Date();

    // If currently active, add the final active period.
    if (session.status === "active") {
      const activeSeconds = Math.floor(
        (endTime.getTime() - session.activeStartTime.getTime()) / 1000,
      );

      session.duration += activeSeconds;
    }

    session.endTime = endTime;
    session.status = "completed";

    await session.save();

    return res.status(200).json({
      message: "Focus session completed",
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
  try {
    const userId = req.user?.id;
    const { sessionId } = req.params;

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

    const endTime = new Date();

    // If active, save the final active seconds.
    if (session.status === "active") {
      const activeSeconds = Math.floor(
        (endTime.getTime() - session.activeStartTime.getTime()) / 1000,
      );

      session.duration += activeSeconds;
    }

    session.endTime = endTime;
    session.status = "cancelled";

    await session.save();

    return res.status(200).json({
      message: "Focus session cancelled",
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

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

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
