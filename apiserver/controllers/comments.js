import express from "express";

import Comment from "../models/comment";
import CommentVote from "../models/commentVote";
import { validateComment } from "../middlewares/validation";
import { checkValidationErrors, asyncHandler } from "../util";
import { authenticateIdToken, checkCommentOwnership, checkCommentVoteOwnership } from "../middlewares/auth";
import CustomError from "../util/CustomError";

const router = express.Router({ mergeParams: true });

//prettier-ignore
router.get("/", asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.post_id }).lean().exec();
  if (comments.length <= 0) throw newCustomError(404, "No comments found");
  res.status(200).json(comments);
}));

//prettier-ignore
router.post("/", authenticateIdToken, validateComment(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const { id } = req.user;
  const { content } = req.body;
  const comment = new Comment({ content, author: id, post: req.params.post_id });

  const createdComment = await comment.save();
  res.status(200).json(createdComment);
}));

//prettier-ignore
router.put("/:comment_id", authenticateIdToken, checkCommentOwnership, validateComment(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw newCustomError(400);

  const updatedComment = await Comment.findOneAndUpdate({ _id: req.params.comment_id},
    { $set: { content: req.body.content}}, { new: true, runValidators: true }).exec();
  res.status(200).json(updatedComment);
}));

//prettier-ignore
router.delete("/:comment_id", authenticateIdToken, checkCommentOwnership, asyncHandler(async (req, res) => {
  await Comment.deleteOne({ _id: req.params.comment_id, post: req.params.post_id }).exec();
  res.status(200).json(req.params.comment_id);
}));

//prettier-ignore
router.post("/:comment_id/commentvotes", authenticateIdToken, asyncHandler(async (req, res) => {
  const { vote } = req.body;
  const { post_id, comment_id } = req.params;
  const commentVote = new CommentVote({ vote, user: req.user.id, comment: comment_id, post: post_id });

  // check for existing vote and remove it
  const foundCommentVote = await CommentVote.findOne({ comment: req.params.comment_id, user: req.user.id }).exec();
  if (foundCommentVote) await foundCommentVote.remove();

  await commentVote.save();
  res.status(200).json({success: "You successfully voted for this comment"});
}));

//prettier-ignore
router.delete("/:comment_id/commentvotes/:commentVote_id", authenticateIdToken, checkCommentVoteOwnership, asyncHandler(async (req, res) => {
  await req.doc.remove();
  res.status(200).json(req.params.commentVote_id);
}));

export default router;
