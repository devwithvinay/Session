import type {NextFunction, Request, Response } from "express";
import FocusSession from "../model/FocusSession.js";


export const startSession = async function (req: Request, res: Response , next: NextFunction) {
  // user Id auth middleware se aygi
  const userId = req.user?.id;
  try {
    if (!userId) {
      return res.status(400).json({
        message: "UnAuthorized",
      });
    }

    // Check user already is in active session

    const activeSession = await FocusSession.findOne({
      user: userId,
      status: "active",
    });

    if (activeSession) {
      return res.status(400).json({
        message: "User already in session",
      });
    }
    // create a new focus session
    const session = await FocusSession.create({
      user: userId,
      startTime: new Date(),
      duration: 0,
      status: "active",
    });

    return res.status(200).json({
      message: "Focus session started",
      success: true,
      session
    });
  } catch (error) {
    next(error)
  }
};

export const completeSession = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.id;
  const { sessionId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({
        message: "failed to authorized",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
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
        message: "Active session not found",
      });
    }

    //current time
    const endTime = new Date();

    // duration on seconds
    const duration = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / 1000,
    );
    session.endTime = endTime;
    session.duration = duration;
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
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const { sessionId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "UnAuthorized",
        success: false,
      });
    }
    if (!sessionId) {
      return res.status(400).json({
        message: "Session is required",
        success: false,
      });
    }
    const cancelsession = await FocusSession.findOne({
      _id: sessionId,
      user: userId,
      status: "active",
    });

    if (!cancelsession) {
      return res.status(400).json({
        message: "Active session is not found",
        success: false, 
      });
    }

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - cancelsession.startTime.getTime()) / 1000,
    );

    cancelsession.endTime = endTime;
    cancelsession.duration = duration;
    cancelsession.status = "cancelled";

    await cancelsession.save();

    return res.status(200).json({
      message: "Focus session cancelled",
      success: true,
      session: cancelsession,
    });
    
  } catch (error) {
    next(error);
  }
};

export const getSession = async function ( req: Request, res: Response , next: NextFunction) {
  try {
    const userId = req.user?.id

    if(!userId){
         return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const session =await FocusSession.findOne({
      user:userId,
    }).sort({
      createdAt:-1
    });

    return res.status(200).json({
      message:"fetching successfully",
      success:true,
      session,
    })
  } catch (error) {
    next(error)
  }
};


export const getSessionHistory = async function ( req: Request, res: Response , next: NextFunction) {

  try {
   const userId = req.user?.id

   if(!userId){
    return res.status(400).json({
      message:"UnAuthorized"
    })
   }
   const page = Number(req.query.page) || 1;
   const limit = Number(req.query.limit) || 20

   const skip = (page-1)* limit

    const sessions = await FocusSession.find({
      user: userId
    }).sort({
      createdAt: -1
    })
    .skip(skip)
    .limit(limit);

    const totalSessions = await FocusSession.countDocuments({
      user: userId,
    })

    const totalPages = Math.ceil(totalSessions / limit)

    return res.status(200).json({
      message: "Session history fetched successfully",
      success: true,
      sessions,
      pagination:{
        page,
        limit,
        totalSessions,
        totalPages
      }
    });
  } catch (error) {
    next(error)
    
  }
}