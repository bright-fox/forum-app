import express from "express";
import Community from "../models/community";
import Post from "../models/post";

import CustomError from "../util/CustomError";

const router = express.Router();

router.get("/", (req, res, next) => {
  Community.find({}, (err, communities) => {
    if (err) return next(err);

    res.status(200).json(communities);
  });
});

router.post("/", (req, res, next) => {
  Community.create(req.body, (err, createdCommunity) => {
    if (err) return next(err);

    res.status(200).json(createdCommunity);
  });
});

router.get("/:community_id", (req, res, next) => {
  Community.findOne({ _id: req.params.community_id }, (err, community) => {
    if (err) return next(err);
    if (!community) return next(new CustomError(404, "No community found"));

    res.status(200).json(community);
  });
});

router.put("/:community_id", (req, res, next) => {
  Community.findOneAndUpdate(
    { _id: req.params.community_id },
    { $set: req.body },
    { new: true },
    (err, updatedCommunity) => {
      if (err) return next(err);
      if (!updatedCommunity)
        return next(new CustomError(404, "No community found to be updated"));

      res.status(200).json(updatedCommunity);
    }
  );
});

router.delete("/:community_id", (req, res, next) => {
  Community.findOneAndDelete({ _id: req.params.community_id }, err => {
    if (err) return next(err);

    res.status(200).json(req.params.community_id);
  });
});

router.get("/:community_id/posts", (req, res, next) => {
  Post.find({ community: req.params.community_id }, (err, posts) => {
    if (err) return next(err);

    if (!posts[0])
      return next(new CustomError(404, "No posts for this community found"));

    res.status(200).json(posts);
  });
});

export default router;
