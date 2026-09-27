import type {Request , Response} from "express"
import FocusSession from "../model/FocusSession.js"
import { calculateStreaks } from "../utils/streaks/streaks.js"

export const getAnalytics = async function(req:Request , res:Response){
    try {
        const userId = req.user?.id
        if(!userId){
            return res.status(400).json({
                message:"UnAuthorized",
                success:false
            })
        }
       //start of today 
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        //start of tommorrow
        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfTomorrow.getDate()+1)

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
            user:userId,
            status:"completed"
        })

        // today's total time spend
        const todayTime = todaySessions.reduce(
            (total , session)=> total + session.duration ,0
        )

        // All time total
        const totalTime = allSessions.reduce(
            (total , session) => total + session.duration , 0
        )

        //Average session duration
        const averageTime = allSessions.length > 0 ? Math.floor(totalTime/allSessions.length) : 0;

        //calculate current and best streak

        const {currentStreak , bestStreak} = calculateStreaks(allSessions)

        return res.status(200).json({
          success: true,
          analytics: {
            todayTime,
            totalTime,
            averageTime,
            currentStreak,
            bestStreak

          },
        });

    } catch (error) {
        console.error("Anaytics error" , error);
        return res.status(500).json({
            message:"Failed to fetch analytics",
            success: false
        })

        
    }
}
