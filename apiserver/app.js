import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "config";
import dotenv from "dotenv";
import cors from "cors";

import communityRoutes from "./routes/communities";
import indexRoutes from "./routes/index.js";
import postRoutes from "./routes/posts";
import userRoutes from "./routes/users";
import commentRoutes from "./routes/comments";
import { handleError, handleMongoError, logError } from "./middlewares";

dotenv.config();
const app = express();

mongoose.connect(config.DBHost, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.set("useFindAndModify", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

// Log the incoming requests
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    console.log(`HTTP ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ROUTES
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/communities", communityRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:post_id/comments", commentRoutes);

// Error handling middleware
if (process.env.NODE_ENV !== "test") app.use(logError);
app.use(handleMongoError);
app.use(handleError);

export default app;
