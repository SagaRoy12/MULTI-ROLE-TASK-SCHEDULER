import dotenv from "dotenv"
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from "./conf/dbConnection.conf.js"
import adminRoute from "./routes/admin.route.js";
import userRoute from './routes/user.route.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/admin_route", adminRoute);
app.use("/api/v1/user_route", userRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});