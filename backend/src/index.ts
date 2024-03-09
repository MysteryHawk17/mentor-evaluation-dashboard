import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import { connectDB } from "./db/connectDB";
import { PORT } from "./configs";
import cors from 'cors';
import { mentorRoutes, studentRoutes } from "./routes";
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.use(cors());

app.use("/api/mentor",mentorRoutes);
app.use("/api/student",studentRoutes);






app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});


connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});