import type { Request, Response } from "express";
import mongoose from "mongoose";
import FocusSession from "../model/FocusSession.js";

export const getLeaderboard = async function (req: Request, res: Response) {
  try {
    const leaderboard = await FocusSession.aggregate([
      {
        $match: {
          status: "completed",
        },
      },

      {
        $group: {
          _id: "$user",

          totalFocusTime: {
            $sum: "$duration",
          },

          totalSessions: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalFocusTime: -1,
        },
      },

      {
        $limit: 100,
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$user.username",
          totalFocusTime: 1,
          totalSessions: 1,
        },
      },
    ]);

    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    return res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully",
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};
