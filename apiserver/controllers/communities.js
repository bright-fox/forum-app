import express from "express";
import handleError from "../handleError";
import Community from "../models/community";

const router = express.Router();

router.get("/", (req, res) => {
  Community.findMany({}, (err, communities) => {
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

export default router;
