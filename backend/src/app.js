import express from "express";
import cors from "cors";
import connectToDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
connectToDB();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// routes
app.get("/", (req, res) => {
  res.send("Hello, World! It's working.");
});

export default app;
