import express from "express";

import Comment from "../models/comment";
import CommentVote from "../models/commentVote";
import { validateCreateComment, validateUpdateComment } from "../middlewares/validation";
import { checkValidationErrors, asyncHandler } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router({ mergeParams: true });

//prettier-ignore
router.get("/", asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.post_id }).lean().exec();
  if (comments.length <= 0) throw newCustomError(404, "No comments found");
  res.status(200).json(comments);
}));

//prettier-ignore
router.post("/", validateCreateComment(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw newCustomError(400);

  const { content, author } = req.body;
  const comment = new Comment({ content, author, post: req.params.post_id });

  const createdComment = await comment.save();
  res.status(200).json(createdComment);
}));

// TODO: findOneAndUpdate is better so it does not trigger save
//prettier-ignore
router.put("/:comment_id", validateUpdateComment(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw newCustomError(400);

  const updatedComment = await Comment.findOneAndUpdate({ _id: req.params.comment_id},
    { $set: { content: req.body.content}}, { new: true, runValidators: true }).exec();
  res.status(200).json(updatedComment);
}));

//prettier-ignore
router.delete("/:comment_id", asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.comment_id).exec();
  if (!comment) throw newCustomError(404, "No comment found to be deleted");

  await Comment.deleteOne({ _id: req.params.comment_id, post: req.params.post_id }).exec();
  res.status(200).json(req.params.comment_id);
}));

//prettier-ignore
router.post("/:comment_id/commentvotes", asyncHandler(async (req, res) => {
  const { vote, user } = req.body;
  const commentVote = new CommentVote({ vote, user, comment: req.params.comment_id, post: req.params.post_id });

  const foundCommentVote = await CommentVote.findOne({ comment: req.params.comment_id, user }).exec();
  if (foundCommentVote) await foundCommentVote.remove();

  const createdCommentVote = await commentVote.save();
  res.status(200).json(createdCommentVote);
}));

//prettier-ignore
router.delete("/:comment_id/commentvotes/:commentVote_id", asyncHandler(async (req, res) => {
  const commentVote = await CommentVote.findById(req.params.commentVote_id).exec();
  if (!commentVote) throw newCustomError(404, "No vote found to be deleted");

  await commentVote.remove();
  res.status(200).json(req.params.commentVote_id);
}));

export default router;
