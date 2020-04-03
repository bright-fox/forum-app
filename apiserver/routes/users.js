import express from "express";
import bcrypt from "bcrypt";
import _ from "lodash";

import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";
import Community from "../models/community";
import CommunityMember from "../models/communityMember";

import { generateIdToken, generateRefreshToken } from "../util";
import { validateUser, validatePassword, validatePage } from "../middlewares/validation";
import { authenticateIdToken, checkUserOwnership } from "../middlewares/auth";
import { checkValidationErrors, asyncHandler, checkPageUnderMax, unescapeDocs } from "../util";
import CustomError from "../util/CustomError";

const router = express.Router();

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const users = await User.find({ $text: { $search: req.query.q } }, { score: { $meta: "textScore" } })
      .sort({
        score: { $meta: "textScore" }
      })
      .exec();
    res.status(200).json({ users });
  })
);

router.get(
  "/:user_id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.user_id)
      .lean()
      .exec();
    if (!user) throw new CustomError(404, "No user found");
    res.status(200).json({ user: unescapeDocs(user, "biography") });
  })
);

// general info update for user

router.put(
  "/:user_id",
  authenticateIdToken,
  checkUserOwnership,
  validateUser(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { doc } = req;

    doc.biography = req.body.biography;
    const updatedUser = await doc.save();

    res.status(200).json({
      success: "You succesfully updated your profile!",
      user: _.omit(unescapeDocs(updatedUser, "biography").toJSON(), "password", "email")
    });
  })
);

router.put(
  "/:user_id/password",
  authenticateIdToken,
  checkUserOwnership,
  validatePassword(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);

    const user = await User.findById(req.user.id)
      .select("+password")
      .exec();

    const { oldPassword, newPassword } = req.body;
    const passwordValid = await bcrypt.compare(oldPassword, user.password);
    if (!passwordValid) throw new CustomError(400, "Wrong password");

    user.password = newPassword;
    const updatedUser = await user.save();

    const payload = { username: updatedUser.username, id: updatedUser._id };
    const idToken = generateIdToken(payload);
    const refreshToken = await generateRefreshToken(payload, updatedUser._id);

    res.status(200).json({ success: "You succesfully updated your password!", idToken, refreshToken });
  })
);

router.delete(
  "/:user_id",
  authenticateIdToken,
  checkUserOwnership,
  asyncHandler(async (req, res) => {
    await req.doc.remove();
    res.status(200).json({ success: "You successfully deleted your account!", docId: req.params.user_id });
  })
);

router.get(
  "/:user_id/private",
  authenticateIdToken,
  checkUserOwnership,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.user_id)
      .select("+email")
      .lean()
      .exec();
    // if (!user) throw new CustomError(404, "No user found"); --> checkUserOwnership checks the same
    res.status(200).json({ user: unescapeDocs(user, "biography") });
  })
);

router.get(
  "/:user_id/home/page/:p",
  authenticateIdToken,
  checkUserOwnership,
  validatePage(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    // get memberships and ownerships of communities
    const memberships = await CommunityMember.find({ member: req.doc._id })
      .lean()
      .exec();
    const c1 = memberships.map(membership => membership.community);
    const ownerships = await Community.find({ creator: req.user.id }, "_id").lean().exec();
    const c2 = ownerships.map(ownership => ownership._id);

    // get communities
    const limit = 30;
    const maxPage = await checkPageUnderMax(Post, { community: { $in: [...c1, ...c2] } }, limit, req.params.p);
    const posts = await Post.find({ community: { $in: [...c1, ...c2] } })
      .sort({ "createdAt": -1 })
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .populate("community")
      .populate("author")
      .lean()
      .exec();

    //if (posts.length <= 0) throw new CustomError(404, "You did not join any communities to see their posts!");
    res.status(200).json({ posts: unescapeDocs(posts, "title", "content"), maxPage, currentPage: req.params.p });
  })
);

router.get(
  "/:user_id/posts/page/:p",
  validatePage(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const limit = 10;
    const maxPage = await checkPageUnderMax(Post, { author: req.params.user_id }, limit, req.params.p);
    const posts = await Post.find({ author: req.params.user_id })
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .populate("community")
      .populate("author")
      .lean()
      .exec();
    //if (posts.length <= 0) throw new CustomError(404, "You did not write any posts!");
    res.status(200).json({ posts: unescapeDocs(posts, "title", "content"), maxPage, currentPage: req.params.p });
  })
);

router.get(
  "/:user_id/comments/page/:p",
  validatePage(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const limit = 10;
    const maxPage = await checkPageUnderMax(Comment, { author: req.params.user_id }, limit, req.params.p);
    const comments = await Comment.find({ author: req.params.user_id })
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .populate("post")
      .populate("author")
      .lean()
      .exec();
    //if (comments.length <= 0) throw new CustomError(404, "You did not write any comments!");
    res.status(200).json({ comments: unescapeDocs(comments, "content"), maxPage, currentPage: req.params.p });
  })
);

router.get(
  "/:user_id/communities/page/:p",
  validatePage(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const limit = 10;
    const maxPage = await checkPageUnderMax(CommunityMember, { member: req.params.user_id }, limit, req.params.p);
    const communityMembers = await CommunityMember.find({ member: req.params.user_id })
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .populate("community")
      .lean()
      .exec();
    await User.populate(communityMembers, { path: "community.creator" })

    //if (communityMembers.length <= 0) throw new CustomError(404, "You did not join any communitites!");
    const communities = communityMembers.map(communityMember => communityMember.community);
    res.status(200).json({ communities: unescapeDocs(communities, "description"), currentPage: req.params.p, maxPage });
  })
);

router.get("/:user_id/communities", asyncHandler(async (req, res) => {
  const adminCommunities = await Community.find({ creator: req.params.user_id }).lean().exec();
  const communityMembers = await CommunityMember.find({ member: req.params.user_id }).populate("community").lean().exec();
  const communities = communityMembers.map(member => member.community);
  res.status(200).json({ adminCommunities, communities });
}));

export default router;
