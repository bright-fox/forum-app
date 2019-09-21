import express from "express";
import mongoose from "mongoose";
import handleError from "../handleError";
import Post from "../models/Post";

const router = express.Router();

router.get("/", (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch the posts!");
    } else {
      res.status(200).json(posts);
    }
  });
});

router.post("/", (req, res) => {
  Post.create(req.body, (err, post) => {
    if (err) {
      handleError(res, err.message, "Failed to create the post!");
    } else {
      res.status(200).json(post);
    }
  });
});

router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch the post!");
      return;
    }

    if (!post) {
      res.status(200).json({});
      return;
    }

    res.status(200).json(post);
  });
});

router.put("/:id", (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true },
    (err, updatedPost) => {
      if (err) {
        handleError(res, err.message, "Failed to update the post!");
        return;
      }

      if (!updatedPost) {
        res.status(200).json({});
        return;
      }

      res.status(200).json(updatedPost);
    }
  );
});

router.delete("/:id", (req, res) => {
  Post.findOneAndDelete({ _id: req.params.id }, (err, removedPost) => {
    if (err) {
      handleError(res, err.message, "Failed to delete post!");
      return;
    }
    res.status(200).json(req.params.id);
  });
});

export default router;
