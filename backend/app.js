import express from "express";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connection } from './src/database/db.connection.js'
import { errorMiddleware } from "./src/middleware/error.js";
import {removeUnverifiedAcc} from './src/automation/removeUnverifiedAcc.js'

export const app = express();
config();

// middleware
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

// routes path 
import userRouter from './src/routes/user.routes.js';

// routes
app.use("/api/v1/user", userRouter);

// automation
removeUnverifiedAcc();

// database connection
connection();


// error middleware
app.use(errorMiddleware);