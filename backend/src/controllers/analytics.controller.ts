import type { Request, Response } from "express";
import FocusSession from "../model/FocusSession.js";
import { calculateStreaks } from "../utils/streaks/streaks.js";
import mongoose from "mongoose";

const TIMEZONE = "Asia/Kolkata";
const IST_OFFSET = "+05:30";

const getTodayString = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: TIMEZONE,
  });
};

const getStartOfDay = (dateString: string) => {
  return new Date(`${dateString}T00:00:00${IST_OFFSET}`);
};

const getStartOfNextDay = (dateString: string) => {
  const startOfDay = getStartOfDay(dateString);

  return new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
};

const isFocusSession = (session: { mode?: "focus" | "short" | "long" }) => {
  return session.mode !== "short" && session.mode !== "long";
};

export const getAnalytics = async function (req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const todayString = getTodayString();

    const startOfToday = getStartOfDay(todayString);

    const startOfTomorrow = getStartOfNextDay(todayString);

    const completedTodaySessions = await FocusSession.find({
      user: userId,
      status: "completed",
      startTime: {
        $gte: startOfToday,
        $lt: startOfTomorrow,
      },
    });

    const todaySessions = completedTodaySessions.filter(isFocusSession);

    const completedSessions = await FocusSession.find({
      user: userId,
      status: "completed",
    });

    const allSessions = completedSessions.filter(isFocusSession);

    const todayTime = todaySessions.reduce(
      (total, session) => total + Number(session.duration || 0),
      0,
    );

    const totalTime = allSessions.reduce(
      (total, session) => total + Number(session.duration || 0),
      0,
    );

    const averageTime =
      allSessions.length > 0 ? Math.floor(totalTime / allSessions.length) : 0;

    const { currentStreak, bestStreak } = calculateStreaks(allSessions);

    return res.status(200).json({
      success: true,

      analytics: {
        todayTime,
        todaySessions: todaySessions.length,
        totalTime,
        averageTime,
        currentStreak,
        bestStreak,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);

    return res.status(500).json({
      message: "Failed to fetch analytics",
      success: false,
    });
  }
};

export const getDailyFocus = async function (req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const dailyFocus = await FocusSession.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: "completed",
        },
      },

      {
        $match: {
          $or: [
            { mode: "focus" },
            { mode: { $exists: false } },
            { mode: null },
          ],
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$startTime",
              timezone: TIMEZONE,
            },
          },

          totalDuration: {
            $sum: "$duration",
          },

          sessions: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id",
          totalDuration: 1,
          sessions: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Daily focus fetched successfully",
      success: true,
      dailyFocus,
    });
  } catch (error) {
    console.error("Daily focus error:", error);

    return res.status(500).json({
      message: "Failed to fetch daily focus",
      success: false,
    });
  }
};

export const getSessionHistory = async function (req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const sessions = await FocusSession.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      message: "Session history fetched successfully",
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Session history error:", error);

    return res.status(500).json({
      message: "Failed to fetch session history",
      success: false,
    });
  }
};
