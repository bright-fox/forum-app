import express from "express";
import User from "../models/user";
import Post from "../models/post";
import handleError from "../handleError";

const router = express.Router();

router.get("/:user_id", (req, res) => {
  User.findOne({ _id: req.params.user_id }, (err, user) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch user");
      return;
    }

    if (!user) {
      res.status(200).json({});
      return;
    }

    res.status(200).json(user);
  });
});

router.post("/", (req, res) => {
  User.create(req.body, (err, user) => {
    if (err) {
      handleError(res, err.message, "Failed to create user");
      return;
    }

    res.status(200).json(user);
  });
});

router.put("/:user_id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.user_id },
    { $set: req.body },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        handleError(res, err.message, "Failed to update the user");
        return;
      }

      if (!updatedUser) {
        res.status(200).json({});
        return;
      }

      res.status(200).json(updatedUser);
    }
  );
});

router.delete("/:user_id", (req, res) => {
  User.findOneAndDelete({ _id: req.params.user_id }, err => {
    if (err) {
      handleError(res, err.message, "Failed to delete User");
    }

    res.status(200).json(req.params.user_id); // needs to be changed, so it reacts to not valid id
  });
});

router.get("/:user_id/home", (req, res) => {
  User.findOne({ _id: req.params.user_id }, (err, user) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch user");
      return;
    }

    if (!user) {
      res.status(400).json({ error: "The user does not exist" });
      return;
    }

    Post.find({ community: { $in: user.communities } }, (err, posts) => {
      if (err) {
        handleError(res, err.message, "Failed to fetch posts");
        return;
      }

      if (!posts[0]) {
        res.status(404).json({ error: "You are in no communities!" });
        return;
      }

      res.status(400).json(posts);
    });
  });
});

router.get("/:user_id/posts", (req, res) => {
  Post.find({ author: req.params.user_id }, (err, posts) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch posts of the user");
      return;
    }

    if (!posts[0]) {
      res.status(400).json({ error: "The user has no posts" });
      return;
    }

    res.status(200).json(posts);
  });
});

export default router;
