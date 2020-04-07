import express from "express";

import { asyncHandler } from "../util"
import CustomError from "../util/CustomError";
import { authenticateIdToken, checkPostVoteOwnership, checkCommentVoteOwnership } from "../middlewares/auth";

import PostVote from "../models/postVote";
import CommentVote from "../models/commentVote";

const router = express.Router();

// ======== POSTS ========

router.get("/posts", authenticateIdToken, asyncHandler(async (req, res) => {
    const { ids } = req.query;
    const votes = await PostVote.find({ user: req.user.id, post: { $in: ids } }).exec();
    if (votes.length <= 0) throw new CustomError(404, "The user did not vote for any of those posts yet.");
    res.status(200).json({ postVotes: votes });
}));

router.get(
    "/posts/:post_id",
    authenticateIdToken,
    asyncHandler(async (req, res) => {
        const postVote = await PostVote.findOne({ post: req.params.post_id, user: req.user.id })
            .lean()
            .exec();
        if (!postVote) throw new CustomError(404, "No vote found");
        res.status(200).json({ postVote });
    })
);

router.post(
    "/posts/:post_id",
    authenticateIdToken,
    asyncHandler(async (req, res) => {
        // check if there is a postvote
        const pv = await PostVote.findOne({ post: req.params.post_id, user: req.user.id }).exec();
        // created new postvote if there is none
        if (!pv) {
            const postVote = new PostVote({ vote: req.body.vote, user: req.user.id, post: req.params.post_id });
            const savedPostVote = await postVote.save();
            return res.status(200).json({ postVote: savedPostVote });
        }
        // throw error if the exact same vote already exists
        if (pv.vote === req.body.vote) throw new CustomError(409, "The user already voted for this post!");
        // update vote 
        Object.assign(pv, { vote: req.body.vote });
        const savedVote = await pv.save();
        res.status(200).json({ postVote: savedVote });
    })
);

router.delete(
    "/:vote_id/posts",
    authenticateIdToken,
    checkPostVoteOwnership,
    asyncHandler(async (req, res) => {
        await req.doc.remove();
        res.status(200).json({ docId: req.params.vote_id });
    })
);

// ======== COMMENTS ========

router.get("/comments", authenticateIdToken, asyncHandler(async (req, res) => {
    const { ids } = req.query;
    const votes = await CommentVote.find({ comment: { $in: ids }, user: req.user.id, }).exec();
    if (votes.length <= 0) throw new CustomError(404, "The user did not vote for any of those comments yet.");
    res.status(200).json({ commentVotes: votes });
}));

// get a comment vote of a specific user for a comment of a post
router.get(
    "/posts/:post_id/comments/:comment_id",
    authenticateIdToken,
    asyncHandler(async (req, res) => {
        const commentVote = await CommentVote.findOne({ comment: req.params.comment_id, user: req.user.id })
            .lean()
            .exec();
        if (!commentVote) throw new CustomError(404, "No vote found");
        res.status(200).json({ commentVote });
    })
);

router.post(
    "/posts/:post_id/comments/:comment_id",
    authenticateIdToken,
    asyncHandler(async (req, res) => {
        // check if there is a comment vote
        const cv = await CommentVote.findOne({ comment: req.params.comment_id, user: req.user.id }).exec();
        if (!cv) {
            const commentVote = new CommentVote({ vote: req.body.vote, comment: req.params.comment_id, user: req.user.id, post: req.params.post_id });
            const savedCommentVote = await commentVote.save();
            return res.status(200).json({ commentVote: savedCommentVote });
        }
        if (cv.vote === req.body.vote) throw new CustomError(409, "The user already voted for this comment!")
        Object.assign(cv, { vote: req.body.vote });
        const savedVote = await cv.save();
        res.status(200).json({ commentVote: savedVote });
    })
);

router.delete(
    "/:vote_id/comments",
    authenticateIdToken,
    checkCommentVoteOwnership,
    asyncHandler(async (req, res) => {
        await req.doc.remove();
        res.status(200).json({ docId: req.params.vote_id });
    })
);

export default router;