import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import communityRoutes from "./controllers/communities";
import postRoutes from "./controllers/posts";
import userRoutes from "./controllers/users";

const app = express();

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/forum_api",
  { useNewUrlParser: true, useCreateIndex: true }
);
mongoose.set("useFindAndModify", false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.use("/users", userRoutes);
app.use("/communities", communityRoutes);
app.use("/posts", postRoutes);

const server = app.listen(process.env.PORT || 8080, () => {
  const port = server.address().port;
  console.log(`App now running on port ${port}`);
});
