import express from "express";
import _ from "lodash";
import Post from "../models/Post";

import { validatePost, validatePage } from "../middlewares/validation";
import {
  checkCommunityOwnerOrMember,
  authenticateIdToken,
  checkPostOwnership
} from "../middlewares/auth";
import { checkValidationErrors, asyncHandler, checkPageUnderMax, unescapeDocs } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const posts = await Post.find({ $text: { $search: req.query.q } }, { score: { $meta: "textScore" } })
      .sort({
        score: { $meta: "textScore" }
      })
      .populate("community")
      .populate("author")
      .exec();
    res.status(200).json({ posts });
  })
);

router.get(
  "/page/:p",
  validatePage(),
  asyncHandler(async (req, res, next) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const limit = 30;
    const maxPage = await checkPageUnderMax(Post, {}, limit, req.params.p);

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .populate("author")
      .populate("community")
      .lean()
      .exec();
    // if (posts.length <= 0) throw new CustomError(404, "There are no posts!");
    res.status(200).json({ posts: unescapeDocs(posts, "title", "content"), currentPage: req.params.p, maxPage });
  })
);

router.post(
  "/",
  authenticateIdToken,
  checkCommunityOwnerOrMember,
  validatePost(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { title, content, community } = req.body;
    const { id } = req.user;
    const post = new Post({ title, content, community, author: id });
    const createdPost = await post.save();
    res.status(200).json({
      success: "You successfully wrote a post!",
      post: _.omit(unescapeDocs(createdPost, "title", "content").toJSON(), "hash")
    });
  })
);

router.get(
  "/:post_id",
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.post_id)
      .populate("author")
      .populate("community")
      .lean()
      .exec();
    if (!post) throw new CustomError(404, "No posts found");
    res.status(200).json({ post: unescapeDocs(post, "title", "content") });
  })
);

router.put(
  "/:post_id",
  authenticateIdToken,
  checkPostOwnership,
  validatePost(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { doc } = req;

    Object.assign(req.doc, { title: req.body.title, content: req.body.content });
    await req.doc.save();
    res.status(200).json({ success: "You successfully updated your post" });
  })
);

router.delete(
  "/:post_id",
  authenticateIdToken,
  checkPostOwnership,
  asyncHandler(async (req, res) => {
    await req.doc.remove();
    res.status(200).json({ success: "You successfully deleted your post!", docId: req.params.post_id });
  })
);

export default router;
