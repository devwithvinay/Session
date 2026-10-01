import type { NextFunction , Request , Response } from "express";


export const errorHandler = (
    error:Error & {statusCode?: number },
    req:Request,
    res: Response,
    next: NextFunction
)=>{
    console.error('Error',error);

    const statusCode = error.statusCode ?? 500
    return res.status(statusCode).json({
        message:error.message || "Internal server Error",
        success:false
    })
}