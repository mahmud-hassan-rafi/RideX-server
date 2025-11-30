import express from "express";
import cors from "cors";
const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
