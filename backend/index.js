import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

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

app.listen(PORT, () => {
  console.log(`Listening to server at PORT: ${PORT}`);
});
