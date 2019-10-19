import express from "express";
import { validationResult } from "express-validator";

import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";

import {
  validateCreateUser,
  validateUpdateUser
} from "../middlewares/validation";
import { checkValidationErrors } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

router.get("/", (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return next(err);

    res.status(200).json(users);
  });
});

router.get("/:user_id", (req, res, next) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new CustomError("No user found"));

    res.status(200).json(user);
  });
});

router.post("/", validateCreateUser(), (req, res, next) => {
  const { username, email } = req.body;
  if (checkValidationErrors(req)) return next(new CustomError(400));

  const user = new User({ username, email });
  user.save((err, savedUser) => {
    if (err) return next(err);
    res.status(200).json(savedUser);
  });
});

router.put("/:user_id", validateUpdateUser(), (req, res, next) => {
  if (checkValidationErrors(req)) return next(new CustomError(400));

  User.findById(req.params.user_id, (err, user) => {
    const { username, email } = req.body;

    if (err) return next(err);
    if (!user) return next(new CustomError(404, "No user found to be updated"));

    user.username = username || user.username;
    user.email = email || user.email;

    user.save((err, updatedUser) => {
      if (err) return next(err);

      res.status(200).json(updatedUser);
    });
  });
});

router.delete("/:user_id", (req, res, next) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new CustomError(404, "No user found to be deleted"));

    user.remove(err => {
      if (err) return next(err);
      res.status(200).json(req.params.user_id);
    });
  });
});

router.get("/:user_id/home", (req, res, next) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new CustomError("No user found"));

    Post.find({ community: { $in: user.communities } }, (err, posts) => {
      if (err) return next(err);
      if (posts.length <= 0)
        return next(new CustomError(404, "You did not join any communities!"));

      res.status(200).json(posts);
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

router.get("/:user_id/communities", (req, res, next) => {
  User.findById(req.params.user_id)
    .populate("communities")
    .exec((err, user) => {
      // only response with communities?
      if (err) return next(err);
      if (!user) return next(new CustomError(404, "No user found"));

      res.status(200).json(user);
    });
});

export default router;
