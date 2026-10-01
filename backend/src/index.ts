import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./utils/db.js";
import cookieParser from "cookie-parser";
// routes 
import userRoutes from "./routes/auth.route.js"
import sessionRoutes from "./routes/session.route.js"
import analyticsRoutes from "./routes/analytics.routes.js"
import { errorHandler } from "./middleware/error.middleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";




dotenv.config();

const app = express();
app.use(helmet());


const port = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE" , "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many attemps",
    success:false
  }
});

app.use(limiter)


// db connect 
connectDB();

//routes
app.use("/api/v1/users",userRoutes)
app.use("/api/v1/session",sessionRoutes)
app.use("/api/v1/analytics",analyticsRoutes)

// global error handle

app.use(errorHandler)

app.listen(port , ()=>{
    console.log(`Server is running on port: ${port}`)
})