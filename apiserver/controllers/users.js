import express from "express";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";

import CustomError from "../util/CustomError";

const router = express.Router();

router.get("/:user_id", (req, res, next) => {
  User.findOne({ _id: req.params.user_id }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new CustomError("No user found"));

    res.status(200).json(user);
  });
});

router.post("/", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);

    res.status(200).json(user);
  });
});

router.put("/:user_id", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.user_id },
    { $set: req.body },
    { new: true },
    (err, updatedUser) => {
      if (err) return next(err);
      if (!updatedUser)
        return next(new CustomError(404, "No user found to be updated"));

      res.status(200).json(updatedUser);
    }
  );
});

router.delete("/:user_id", (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.user_id }, err => {
    if (err) return next(err);

    res.status(200).json(req.params.user_id); // needs to be changed, so it reacts to not valid id
  });
});

router.get("/:user_id/home", (req, res, next) => {
  User.findOne({ _id: req.params.user_id }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new CustomError("No user found"));

    Post.find({ community: { $in: user.communities } }, (err, posts) => {
      if (err) return next(err);
      if (posts.length <= 0)
        return next(new CustomError(404, "You did not join any communities!"));

      res.status(400).json(posts);
    });
  });
});

router.get("/:user_id/posts", (req, res, next) => {
  Post.find({ author: req.params.user_id }, (err, posts) => {
    if (err) return next(err);
    if (posts.length <= 0)
      return next(new CustomError("You did not post any posts!"));

    res.status(200).json(posts);
  });
});

router.get("/:user_id/comments", (req, res, next) => {
  Comment.find({ author: req.params.user_id }, (err, comments) => {
    if (err) return next(err);
    if (comments.length <= 0)
      return next(new CustomError(404, "You did not write any comments!"));

    res.status(200).json(comments);
  });
});

export default router;
