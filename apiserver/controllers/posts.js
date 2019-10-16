import express from "express";
import Post from "../models/Post";

import CustomError from "../util/CustomError";

const router = express.Router();

router.get("/", (req, res, next) => {
  Post.find({})
    .sort({ createdAt: -1 })
    .exec((err, posts) => {
      if (err) return next(err);

      res.status(200).json(posts);
    });
});

router.post("/", (req, res, next) => {
  Post.create(req.body, (err, post) => {
    if (err) return next(err);
    res.status(200).json(post);
  });
});

router.get("/:id", (req, res, next) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    if (err) return next(err);
    if (!post) return next(new CustomError(404, "No posts found"));

    res.status(200).json(post);
  });
});

router.put("/:id", (req, res, next) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true },
    (err, updatedPost) => {
      if (err) return next(err);
      if (!updatedPost)
        return next(new CustomError(404, "No post found to be updated"));

      res.status(200).json(updatedPost);
    }
  );
});

router.delete("/:id", (req, res, next) => {
  Post.findOneAndDelete({ _id: req.params.id }, (err, removedPost) => {
    if (err) return next(err);

    res.status(200).json(req.params.id);
  });
});

export default router;
