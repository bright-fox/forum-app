import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
//import expressValidator from "express-validator";

import communityRoutes from "./controllers/communities";
import postRoutes from "./controllers/posts";
import userRoutes from "./controllers/users";
import commentRoutes from "./controllers/comments";
import { handleError, handleMongoError, logError } from "./middlewares";

const app = express();

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/forum_api",
  { useNewUrlParser: true, useCreateIndex: true }
);
mongoose.set("useFindAndModify", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressValidator());

// ROUTES
app.use("/users", userRoutes);
app.use("/communities", communityRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:post_id/comments", commentRoutes);

// Error handling middleware
app.use(logError);
app.use(handleMongoError);
app.use(handleError);

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App now running on port ${port}`);
});
