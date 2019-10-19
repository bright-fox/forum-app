import express from "express";

import Comment from "../models/comment";
import {
  validateCreateComment,
  validateUpdateComment
} from "../middlewares/validation";
import { checkValidationErrors } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router({ mergeParams: true });

router.get("/", (req, res, next) => {
  Comment.find({ post: req.params.post_id }, (err, comments) => {
    if (err) return next(err);

    // TODO: Is that necessary?
    if (comments.length <= 0)
      return next(new CustomError(404, "No comments found"));

    res.status(200).json(comments);
  });
});

router.post("/", validateCreateComment(), (req, res, next) => {
  const { content, author, post } = req.body;
  if (checkValidationErrors(req)) return next(new CustomError(400));

  const comment = new Comment({ content, author, post });
  comment.save((err, createdComment) => {
    if (err) return next(err);
    res.status(200).json(createdComment);
  });
});

router.put("/:comment_id", validateUpdateComment(), (req, res, next) => {
  if (checkValidationErrors(req)) return next(new CustomError(400));

  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) return next(err);
    if (!comment)
      return next(new CustomError(404, "No comment found to be updated"));

    comment.content = req.body.content || comment.content;
    comment.save((err, updatedComment) => {
      if (err) return next(err);

      res.status(200).json(updatedComment);
    });
  });
});

router.delete("/:comment_id", (req, res, next) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) return next(err);
    if (!comment)
      return next(new CustomError(404, "No comment found to be deleted"));

    comment.remove(err => {
      if (err) return next(err);
      res.status(200).json(req.params.comment_id);
    });
  });
});

export default router;
