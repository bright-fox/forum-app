import express from "express";
import Comment from "../models/comment";
import handleError from "../handleError";

const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
  Comment.find({ post: req.params.post_id }, (err, comments) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch comments of post");
      return;
    }

    if (!comments[0]) {
      res.status(200).json({});
      return;
    }

    res.status(200).json(comments);
  });
});

router.post("/", (req, res) => {
  Comment.create(req.body, (err, comment) => {
    if (err) {
      handleError(res, err.message, "Failed to create comment");
      return;
    }

    res.status(200).json(comment);
  });
});

router.put("/:comment_id", (req, res) => {
  Comment.findOneAndUpdate(
    { _id: req.params.comment_id },
    { $set: req.body },
    { new: true },
    (err, updatedComment) => {
      if (err) {
        handleError(res, err.message, "Failed to update comment");
        return;
      }

      if (!updatedComment) {
        res.status(200).json({});
        return;
      }

      res.status(200).json(updatedComment);
    }
  );
});

router.delete("/:comment_id", (req, res) => {
  Comment.findOneAndDelete({ _id: req.params.comment_id }, err => {
    if (err) {
      handleError(res, err.message, "Failed to delete comment");
      return;
    }

    res.status(200).json(req.params.comment_id);
  });
});

export default router;
