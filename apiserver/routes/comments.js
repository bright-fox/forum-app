import express from "express";
import _ from "lodash";
import Comment from "../models/comment";
import { validateComment, validatePage } from "../middlewares/validation";
import {
  checkValidationErrors,
  asyncHandler,
  unescapeDocs,
  checkPageUnderMax,
  getNestedComments,
  deleteComment
} from "../util";
import { authenticateIdToken, checkCommentOwnership } from "../middlewares/auth";
import CustomError from "../util/CustomError";

const router = express.Router({ mergeParams: true });

router.get(
  "/page/:p",
  validatePage(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const limit = 20;
    const selection = { post: req.params.post_id, replyTo: undefined };
    const maxPage = await checkPageUnderMax(Comment, selection, limit, req.params.p);
    const comments = await Comment.find(selection)
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .populate("author")
      .lean()
      .exec();
    // if (comments.length <= 0) throw new CustomError(404, "No comments yet");
    await getNestedComments(comments);
    res.status(200).json({ comments: unescapeDocs(comments, "content"), currentPage: req.params.p, maxPage });
  })
);

router.get("/:comment_id", asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.comment_id }).lean().exec();
  if (!comment) throw new CustomError(404, "No comment found");
  res.status(200).json({ comment: unescapeDocs(comment, "content") });
}))

router.post(
  "/",
  authenticateIdToken,
  validateComment(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const comment = new Comment({ content: req.body.content, author: req.user.id, post: req.params.post_id });
    if (req.body.replyTo) comment.replyTo = req.body.replyTo;

    const createdComment = await comment.save();
    res.status(200).json({
      success: "You successfully wrote a comment!",
      comment: _.omit(unescapeDocs(comment, "content").toJSON(), "hash")
    });
  })
);

router.put(
  "/:comment_id",
  authenticateIdToken,
  checkCommentOwnership,
  validateComment(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);

    Object.assign(req.doc, { content: req.body.content });
    const updatedComment = await req.doc.save();
    res.status(200).json({
      success: "You successfully update your comment!",
      comment: _.omit(unescapeDocs(updatedComment, "content").toJSON(), "hash")
    });
  })
);

router.delete(
  "/:comment_id",
  authenticateIdToken,
  checkCommentOwnership,
  asyncHandler(async (req, res) => {
    await deleteComment(req.doc);
    res.status(200).json({ success: "You successfully deleted your comment!", docId: req.doc._id });
  })
);

export default router;
