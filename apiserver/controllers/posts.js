import express from "express";
import Post from "../models/Post";
import PostVote from "../models/postVote";

import { validateCreatePost, validateUpdatePost } from "../middlewares/validation";
import { checkValidationErrors, asyncHandler } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

//prettier-ignore
router.get("/", asyncHandler(async(req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).lean().exec();
  res.status(200).json(posts);
}));

//prettier-ignore
router.post("/", validateCreatePost(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);
  const { title, content, author, community } = req.body;
  const post = new Post({ title, content, author, community });

  const createdPost = await post.save();
  res.status(200).json(createdPost);
}));

//prettier-ignore
router.get("/:post_id", asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.post_id).lean().exec();
  if (!post) throw new CustomError(404, "No posts found");
  res.status(200).json(post);
}));

//prettier-ignore
router.put("/:post_id", validateUpdatePost(), asyncHandler(async (req, res) => {
  if (checkValidationErrors(req)) throw new CustomError(400);

  const post = await Post.findById(req.params.post_id).exec();
  if (!post) throw new CustomError(404, "No post found to be updated");
  const { title, content } = req.body;
  
  post.title = title || post.title;
  post.content = content || post.content;

  const updatedPost = await post.save();
  res.status(200).json(updatedPost);
}));

//prettier-ignore
router.delete("/:post_id", asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.post_id).exec();
  if (!post) throw new CustomError(404, "No post found to be deleted");

  await post.remove();
  res.status(200).json(req.params.post_id);
}));

//prettier-ignore
router.post("/:post_id/postvotes", asyncHandler(async (req, res) => {
  const { vote, user } = req.body;
  const postVote = new PostVote({ vote, user, post: req.params.post_id });

  const foundPostVote = await PostVote.findOne({ post: req.params.post_id, user }).exec();
  if (foundPostVote) await foundPostVote.remove();
  const createdPostVote = await postVote.save();
  res.status(200).json(createdPostVote);
}));

//prettier-ignore
router.delete("/:post_id/postvotes/:postVote_id", asyncHandler(async (req, res) => {
  const postVote = await PostVote.findById(req.params.postVote_id).exec();
  if (!postVote) throw new CustomError(404, "No vote found to be deleted");
  await postVote.remove();
  res.status(200).json(req.params.postVote_id);
}));

export default router;
