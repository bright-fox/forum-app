import express from "express";
import Comment from "../models/comment";

import CustomError from "../util/CustomError";

const router = express.Router({ mergeParams: true });

router.get("/", (req, res, next) => {
  Comment.find({ post: req.params.post_id }, (err, comments) => {
    if (err) return next(err);

    if (comments.length <= 0)
      return next(new CustomError(404, "No comments found"));

    res.status(200).json(comments);
  });
});

router.post("/", (req, res, next) => {
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);

    res.status(200).json(comment);
  });
});

router.put("/:comment_id", (req, res, next) => {
  Comment.findOneAndUpdate(
    { _id: req.params.comment_id },
    { $set: req.body },
    { new: true },
    (err, updatedComment) => {
      if (err) return next(err);

      if (!updatedComment)
        return next(new CustomError(404, "No comment found to be updated"));

      res.status(200).json(updatedComment);
    }
  );
});

router.delete("/:comment_id", (req, res, next) => {
  Comment.findOneAndDelete({ _id: req.params.comment_id }, err => {
    if (err) return next(err);

    res.status(200).json(req.params.comment_id);
  });
});

export default router;
