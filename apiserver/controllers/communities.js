import express from "express";
import handleError from "../handleError";
import Community from "../models/community";
import Post from "../models/post";

const router = express.Router();

router.get("/", (req, res) => {
  Community.find({}, (err, communities) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch communities");
      return;
    }

    res.status(200).json(communities);
  });
});

router.post("/", (req, res) => {
  Community.create(req.body, (err, createdCommunity) => {
    if (err) {
      handleError(res, err.message, "Failed to create community");
      return;
    }

    res.status(200).json(createdCommunity);
  });
});

router.get("/:community_id", (req, res) => {
  Community.findOne({ _id: req.params.community_id }, (err, community) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch community");
      return;
    }

    if (!community) {
      res.status(200).json({});
      return;
    }

    res.status(200).json(community);
  });
});

router.put("/:community_id", (req, res) => {
  Community.findOneAndUpdate(
    { _id: req.params.community_id },
    { $set: req.body },
    { new: true },
    (err, updatedCommunity) => {
      if (err) {
        handleError(res, err.message, "Failed to update community");
        return;
      }

      if (!updatedCommunity) {
        res.status(200).json({});
        return;
      }

      res.status(200).json(updatedCommunity);
    }
  );
});

router.delete("/:community_id", (req, res) => {
  Community.findOneAndDelete({ _id: req.params.community_id }, err => {
    if (err) {
      handleError(res, err.message, "Failed to delete community");
      return;
    }

    res.status(200).json(req.params.community_id);
  });
});

router.get("/:community_id/posts", (req, res) => {
  Post.find({ community: req.params.community_id }, (err, posts) => {
    if (err) {
      handleError(res, err.message, "Failed to fetch the posts");
      return;
    }

    if (!posts[0]) {
      res.status(200).json({});
      return;
    }

    res.status(200).json(posts);
  });
});

export default router;
