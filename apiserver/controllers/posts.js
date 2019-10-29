import express from "express";
import Post from "../models/Post";
import PostVote from "../models/postVote";

import {
  validateCreatePost,
  validateUpdatePost
} from "../middlewares/validation";
import { checkValidationErrors } from "../util";
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

router.post("/", validateCreatePost(), (req, res, next) => {
  const { title, content, author, community } = req.body;
  if (checkValidationErrors(req)) return next(new CustomError(400));

  const post = new Post({ title, content, author, community });

  post.save((err, createdPost) => {
    if (err) return next(err);
    res.status(200).json(createdPost);
  });
});

router.get("/:post_id", (req, res, next) => {
  Post.findById(req.params.post_id, (err, post) => {
    if (err) return next(err);
    if (!post) return next(new CustomError(404, "No posts found"));

    res.status(200).json(post);
  });
});

router.put("/:post_id", validateUpdatePost(), (req, res, next) => {
  if (checkValidationErrors(req)) return next(new CustomError(400));

  Post.findById(req.params.post_id, (err, post) => {
    const { title, content } = req.body;

    if (err) return next(err);
    if (!post) return next(new CustomError(404, "No post found to be updated"));

    post.title = title || post.title;
    post.content = content || post.content;

    post.save((err, updatedPost) => {
      if (err) return next(err);

      res.status(200).json(updatedPost);
    });
  });
});

router.delete("/:post_id", (req, res, next) => {
  Post.findById(req.params.post_id, (err, post) => {
    if (err) return next(err);
    if (!post) return next(new CustomError(404, "No post found to be deleted"));

    post.remove(err => {
      if (err) return next(err);

      res.status(200).json(req.params.post_id);
    });
  });
});

router.post("/:post_id/postvotes", (req, res, next) => {
  const { vote, user } = req.body;
  const postVote = new PostVote({ vote, user, post: req.params.post_id });

  PostVote.findOne({ post: req.params.post_id, user }, (err, foundPostVote) => {
    if (err) return next(err);
    if (foundPostVote) {
      foundPostVote.remove(err => {
        if (err) return next(err);
      });
    }
  });

  postVote.save((err, createdPostVote) => {
    if (err) return next(err);

    res.status(200).json(createdPostVote);
  });
});

router.delete("/:post_id/postvotes/:postVote_id", (req, res, next) => {
  PostVote.findById(req.params.postVote_id, (err, postVote) => {
    if (err) return next(err);
    if (!postVote)
      return next(new CustomError(404, "No vote found to be deleted"));

    res.status(200).json(req.params.postVote_id);
  });
});

export default router;
