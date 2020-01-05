import express from "express";
import _ from "lodash";
import Post from "../models/Post";
import PostVote from "../models/postVote";

import { validatePost, validatePage } from "../middlewares/validation";
import {
  checkCommunityOwnerOrMember,
  authenticateIdToken,
  checkPostOwnership,
  checkPostVoteOwnership
} from "../middlewares/auth";
import { checkValidationErrors, asyncHandler, checkPageUnderMax, unescapeDocs } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

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

router.get(
  "/:post_id/votes",
  authenticateIdToken,
  asyncHandler(async (req, res) => {
    const postVote = await PostVote.findOne({ post: req.params.post_id, user: req.user.id })
      .lean()
      .exec();
    if (!postVote) throw new CustomError(404, "No vote found");
    res.status(200).json(postVote);
  })
);

router.post(
  "/:post_id/votes",
  authenticateIdToken,
  asyncHandler(async (req, res) => {
    const { vote } = req.body;
    const postVote = new PostVote({ vote, user: req.user.id, post: req.params.post_id });

    // check for existing vote of user and remove it
    const foundPostVote = await PostVote.findOne({ post: req.params.post_id, user: req.user.id }).exec();
    if (foundPostVote) await foundPostVote.remove();

    const createdVote = await postVote.save();
    res.status(200).json({ success: "You successfully voted for this post", createdVote });
  })
);

router.delete(
  "/:post_id/votes/:vote_id",
  authenticateIdToken,
  checkPostVoteOwnership,
  asyncHandler(async (req, res) => {
    await req.doc.remove();
    res.status(200).json({ docId: req.params.vote_id });
  })
);

export default router;
