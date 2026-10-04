import type { Request, Response } from "express";
import FocusSession from "../model/FocusSession.js";
import { calculateStreaks } from "../utils/streaks/streaks.js";
import mongoose from "mongoose";

export const getAnalytics = async function (req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        message: "UnAuthorized",
        success: false,
      });
    }
    //start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    //start of tommorrow
    const startOfTomorrow = new Date();
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    //Todays complete session
    const todaySessions = await FocusSession.find({
      user: userId,
      status: "completed",
      startTime: {
        $gte: startOfToday, //greater than or equal to
        $lt: startOfTomorrow,
      },
    });

    //total completed sessions
    const allSessions = await FocusSession.find({
      user: userId,
      status: "completed",
    });

    // today's total time spend
    const todayTime = todaySessions.reduce(
      (total, session) => total + session.duration,
      0,
    );

    // All time total
    const totalTime = allSessions.reduce(
      (total, session) => total + session.duration,
      0,
    );

    //Average session duration
    const averageTime =
      allSessions.length > 0 ? Math.floor(totalTime / allSessions.length) : 0;

    //calculate current and best streak

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
    console.error("Anaytics error", error);
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
        message: "UnAuthorized",
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
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$startTime",
            },
          },
          totalDuration: {
            $sum: "$duration",
          },
          sessions:{
            $sum: 1
          }
        },
      },
      {
        $sort: {
            _id: 1,
        }
      },
      {
        $project: {
            _id: 0,
            date: "$_id",
            totalDuration: 1,
            sessions: 1,
        }
      }
    ]);

    return res.status(200).json({
        message:" Daily focusesd fetched successfully",
        success: true,
        dailyFocus
    })

  } catch (error) {
    console.error("Daily focus error: " , error)
    return res.status(500).json({
        message:"failed to fetch daily focus",
        success:false
    })
  }
};

export const getSessionHistory = async function(req:Request , res:Response){
  try {
    const userId = req.user?.id
    if(!userId){
      return res.status(400).json({
        message :"UnAuthorized",
        success:false
      })
    }

    const sessions = await FocusSession.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .select("-__v");

      return res.status(200).json({
        message:"Session History fetch successfully",
        success:true,
        sessions
      })
  } catch (error) {
    console.log('session history error' , error);
    return res.status(500).json({
      message: "Failed to fetch session history",
      success:false,
      error
    })
  }
}
