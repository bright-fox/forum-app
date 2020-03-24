import express from "express";

import { authenticateIdToken } from "../middlewares/auth";
import { asyncHandler } from "../util"

import PostVote from "../models/postVote";
import CommentVote from "../models/commentVote";

const router = express.Router();

router.get("/posts", authenticateIdToken, asyncHandler(async (req, res) => {
    const { ids } = req.query;
    const votes = await PostVote.find({ user: req.user.id, post: { $in: ids } }).exec();
    if (!votes) throw new CustomError(404, "The user did not vote for any of those posts yet.");
    res.status(200).json({ votes });
}));

router.get("/comments", authenticateIdToken, asyncHandler(async (req, res) => {
    const { ids } = req.query;
    const votes = await CommentVote.find({ user: req.user.id, comment: { $in: ids } }).exec();
    if (!votes) throw new CustomError(404, "The user did not vote for any of those comments yet.");
    res.status(200).json({ votes });
}));

export default router;