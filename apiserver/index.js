import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import communityRoutes from "./controllers/communities";
import postRoutes from "./controllers/posts";
import userRoutes from "./controllers/users";
import commentRoutes from "./controllers/comments";

const app = express();

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/forum_api",
  { useNewUrlParser: true, useCreateIndex: true }
);
mongoose.set("useFindAndModify", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middleware
app.use((err, req, res, next) => {
  console.log("This is the middleware speaking!");
  res.status(err.status || 500).json({ err });
});

// ROUTES
app.use("/users", userRoutes);
app.use("/communities", communityRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:post_id/comments", commentRoutes);

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App now running on port ${port}`);
});
