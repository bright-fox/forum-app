import express from "express";

import Comment from "../models/comment";
import CommentVote from "../models/commentVote";
import { validateComment, validatePage } from "../middlewares/validation";
import { checkValidationErrors, asyncHandler, unescapeDocs, checkPageUnderMax } from "../util";
import { authenticateIdToken, checkCommentOwnership, checkCommentVoteOwnership } from "../middlewares/auth";
import CustomError from "../util/CustomError";

const router = express.Router({ mergeParams: true });

router.get(
  "/page/:p",
  validatePage(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const limit = 30;
    const maxPage = await checkPageUnderMax(Comment, { post: req.params.post_id }, limit, req.params.p);
    const comments = await Comment.find({ post: req.params.post_id })
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .lean()
      .exec();
    if (comments.length <= 0) throw newCustomError(404, "No comments found");
    res.status(200).json({ comments: unescapeDocs(comments, "content"), currentPage: req.params.p, maxPage });
  })
);

router.post(
  "/",
  authenticateIdToken,
  validateComment(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { id } = req.user;
    const { content } = req.body;
    const comment = new Comment({ content, author: id, post: req.params.post_id });

    const createdComment = await comment.save();
    res.status(200).json({ success: "You successfully wrote a comment!", comment: unescapeDocs(comment, "content") });
  })
);

router.put(
  "/:comment_id",
  authenticateIdToken,
  checkCommentOwnership,
  validateComment(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw newCustomError(400);

    Object.assign(req.doc, { content: req.body.content });
    const updatedComment = await req.doc.save();
    res
      .status(200)
      .json({ success: "You successfully update your comment!", comment: unescapeDocs(updatedComment, "content") });
  })
);

router.delete(
  "/:comment_id",
  authenticateIdToken,
  checkCommentOwnership,
  asyncHandler(async (req, res) => {
    await Comment.deleteOne({ _id: req.params.comment_id, post: req.params.post_id }).exec();
    res.status(200).json({ success: "You successfully deleted your comment!", docId: req.params.comment_id });
  })
);

router.post(
  "/:comment_id/commentvotes",
  authenticateIdToken,
  asyncHandler(async (req, res) => {
    const { vote } = req.body;
    const { post_id, comment_id } = req.params;
    const commentVote = new CommentVote({ vote, user: req.user.id, comment: comment_id, post: post_id });

    // check for existing vote and remove it
    const foundCommentVote = await CommentVote.findOne({ comment: req.params.comment_id, user: req.user.id }).exec();
    if (foundCommentVote) await foundCommentVote.remove();

    await commentVote.save();
    res.status(200).json({ success: "You successfully voted for this comment" });
  })
);

router.delete(
  "/:comment_id/commentvotes/:commentVote_id",
  authenticateIdToken,
  checkCommentVoteOwnership,
  asyncHandler(async (req, res) => {
    await req.doc.remove();
    res.status(200).json({ docId: req.params.commentVote_id });
  })
);

export default router;
