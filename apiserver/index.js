import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import communityRoutes from "./controllers/communities";
import indexRoutes from "./controllers";
import postRoutes from "./controllers/posts";
import userRoutes from "./controllers/users";
import commentRoutes from "./controllers/comments";
import { handleError, handleMongoError, logError } from "./middlewares";

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });
mongoose.set("useFindAndModify", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

const server = app.listen(process.env.PORT, () => {
  const port = server.address().port;
  console.log(`App now running on port ${port}`);
});

export default server;
