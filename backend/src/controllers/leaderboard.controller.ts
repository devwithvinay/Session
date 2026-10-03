import type { Request , Response } from "express";
import mongoose from "mongoose";
import FocusSession from "../model/FocusSession.js";

export const getLeaderboard = async function (req: Request, res: Response) {
  try {
    const leaderboard = await FocusSession.aggregate([
      // Only completed sessions
      {
        $match: {
          status: "completed",
        },
      },

      // Group sessions by user
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

      // Sort users by total focus time
      {
        $sort: {
          totalFocusTime: -1,
        },
      },

      // Get top 100 users
      {
        $limit: 100,
      },

      // Get user information
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      // Convert user array into object
      {
        $unwind: "$user",
      },

      // Select the fields we need
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

    // Add rank
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
