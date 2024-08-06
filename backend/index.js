import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import getDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import companyRouter from "./routes/company.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";

dotenv.config({});

const PORT = process.env.BACKEND_SERVICE_PORT || 3000;
const app = express();
const CORS_OPTIONS = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

app.get("/health-check", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Backend service running",
  });
});

app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);
app.use("/applications", applicationRouter);

app.listen(PORT, () => {
  getDB();
  console.log(`Listening to server at PORT: ${PORT}`);
});
