import express from "express";

import Comment from "../models/comment";
import CommentVote from "../models/commentVote";
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
  const { content, author } = req.body;
  if (checkValidationErrors(req)) return next(new CustomError(400));

  const comment = new Comment({ content, author, post: req.params.post_id });
  comment.save((err, createdComment) => {
    if (err) return next(err);
    res.status(200).json(createdComment);
  });
});

// TODO: findOneAndUpdate is better so it does not trigger save
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

    Comment.deleteOne(
      { _id: req.params.comment_id, post: req.params.post_id },
      err => {
        if (err) return next(err);
        res.status(200).json(req.params.comment_id);
      }
    );
  });
});

router.post("/:comment_id/commentvotes", (req, res, next) => {
  console.log("hit");
  const { vote, user } = req.body;
  const commentVote = new CommentVote({
    vote,
    user,
    comment: req.params.comment_id,
    post: req.params.post_id
  });

  CommentVote.findOne(
    { comment: req.params.comment_id, user },
    (err, foundCommentVote) => {
      if (err) return next(err);
      if (foundCommentVote) {
        console.log("We found him");
        foundCommentVote.remove(err => {
          if (err) return next(err);
        });
      }
    }
  );

  commentVote.save((err, createdCommentVote) => {
    if (err) return next(err);
    res.status(200).json(createdCommentVote);
  });
});

router.delete("/:comment_id/commentvotes/:commentVote_id", (req, res, next) => {
  CommentVote.findById(req.params.commentVote_id, (err, commentVote) => {
    if (err) return next(err);
    if (!commentVote)
      return next(new CustomError(404, "No vote found to be deleted"));

    res.status(200).json(req.params.commentVote_id);
  });
});

export default router;
