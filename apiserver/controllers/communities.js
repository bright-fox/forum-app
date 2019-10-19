import express from "express";
import Community from "../models/community";
import Post from "../models/post";

import {
  validateCreateCommunity,
  validateUpdateCommunity
} from "../middlewares/validation";
import { checkValidationErrors } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

router.get("/", (req, res, next) => {
  Community.find({}, (err, communities) => {
    if (err) return next(err);

    res.status(200).json(communities);
  });
});

router.post("/", validateCreateCommunity(), (req, res, next) => {
  const { name, creator, description } = req.body;
  if (checkValidationErrors(req)) return next(new CustomError(400));

  const community = new Community({ name, creator, description });

  community.save((err, createdCommunity) => {
    if (err) return next(err);

    res.status(200).json(createdCommunity);
  });
});

router.get("/:community_id", (req, res, next) => {
  Community.findById(req.params.community_id, (err, community) => {
    if (err) return next(err);
    if (!community) return next(new CustomError(404, "No community found"));

    res.status(200).json(community);
  });
});

router.put("/:community_id", validateUpdateCommunity(), (req, res, next) => {
  if (checkValidationErrors(req)) return next(new CustomError(400));

  Community.findById(req.params.community_id, (err, community) => {
    const { name, description } = req.body;

    if (err) return next(err);
    if (!community)
      return next(new CustomError(404, "No community found to be updated"));

    community.name = name || community.name;
    community.description = description || community.description;

    community.save((err, updatedCommunity) => {
      if (err) return next(err);
      res.status(200).json(updatedCommunity);
    });
  });
});

router.delete("/:community_id", (req, res, next) => {
  Community.findById(req.params.community_id, (err, community) => {
    if (err) return next(err);
    if (!community)
      return next(new CustomError(404, "No community found to be deleted"));

    community.remove(err => {
      if (err) return next(err);
      res.status(200).json(req.params.community_id);
    });
  });
});

router.get("/:community_id/posts", (req, res, next) => {
  Post.find({ community: req.params.community_id }, (err, posts) => {
    if (err) return next(err);

    if (posts.length <= 0)
      return next(new CustomError(404, "No posts for this community found"));

    res.status(200).json(posts);
  });
});

export default router;
