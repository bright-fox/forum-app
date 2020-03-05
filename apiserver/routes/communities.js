import express from "express";
import Community from "../models/community";
import CommunityMember from "../models/communityMember";
import Post from "../models/post";

import { validateCommunity, validatePage } from "../middlewares/validation";
import { authenticateIdToken, checkCommunityOwnership, checkCommunityMemberOwnership } from "../middlewares/auth";
import { checkValidationErrors, asyncHandler, unescapeDocs, checkPageUnderMax } from "../util";
import CustomError from "../util/CustomError";
import GrowingCommunity from "../models/growingCommunity";
import { oneWeek } from "../util/variables";
import { updateGrowingCommunitiesList } from "../cronjobs";

const router = express.Router();

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const communities = await Community.find({ $text: { $search: req.query.q } }, { score: { $meta: "textScore" } })
      .sort({
        score: { $meta: "textScore" }
      })
      .exec();
    res.status(200).json({ communities });
  })
);

router.get(
  "/growing",
  asyncHandler(async (req, res) => {
    const communities = await GrowingCommunity.find({ createdAt: { $gte: Date.now() - oneWeek } })
      .limit(10)
      .populate("community")
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(communities);
  })
);

router.get(
  "/page/:p",
  validatePage(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const limit = 20;
    const maxPage = await checkPageUnderMax(Community, {}, limit, req.params.p);

    const communities = await Community.find({})
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .populate("creator")
      .populate("community")
      .lean()
      .exec();
    // if (communities.length <= 0) throw new CustomError(404, "There are no communities yet!"); --> does not get called because of checkPageUnderMax check
    res.status(200).json({ communities: unescapeDocs(communities, "description"), currentPage: req.params.p, maxPage });
  })
);

router.post(
  "/",
  authenticateIdToken,
  validateCommunity(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const { name, description } = req.body;
    const community = new Community({ name, creator: req.user.id, description });
    const createdCommunity = await community.save();
    res.status(200).json({
      success: "You successfully created a community!",
      community: unescapeDocs(createdCommunity, "description")
    });
  })
);

router.get(
  "/:community_id",
  asyncHandler(async (req, res) => {
    const community = await Community.findById(req.params.community_id)
      .populate("creator")
      .populate("community")
      .lean()
      .exec();
    if (!community) throw new CustomError(404, "No community found");
    res.status(200).json({ community: unescapeDocs(community, "description") });
  })
);

router.put(
  "/:community_id",
  authenticateIdToken,
  checkCommunityOwnership,
  validateCommunity(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    Object.assign(req.doc, { name: req.body.name, description: req.body.description });
    await req.doc.save();
    res.status(200).json({ success: "You successfully updated your community" });
  })
);

router.delete(
  "/:community_id",
  authenticateIdToken,
  checkCommunityOwnership,
  asyncHandler(async (req, res) => {
    await req.doc.remove();
    res.status(200).json({ success: "You successfully deleted the community!", docId: req.params.community_id });
  })
);

router.get(
  "/:community_id/posts/page/:p",
  validatePage(),
  asyncHandler(async (req, res) => {
    if (checkValidationErrors(req)) throw new CustomError(400);
    const limit = 30;
    const maxPage = await checkPageUnderMax(Post, { community: req.params.community_id }, limit, req.params.p);

    const posts = await Post.find({ community: req.params.community_id })
      .skip(req.params.p * limit - limit)
      .limit(limit)
      .populate("author")
      .populate("community")
      .lean()
      .exec();
    // if (posts.length <= 0) throw new CustomError(404, "No posts for this community found"); --> wont be check because of checkPageUnderMax
    res.status(200).json({ posts: unescapeDocs(posts, "title", "content"), currentPage: req.params.p, maxPage });
  })
);

router.get(
  "/:community_id/members/status",
  authenticateIdToken,
  asyncHandler(async (req, res) => {
    const { id } = req.user;
    const member = await CommunityMember.findOne({ member: id, community: req.params.community_id }).exec();
    if (!member) throw new CustomError(404, "Not a member of this community");
    res.status(200).json(member);
  })
);

router.post(
  "/:community_id/members",
  authenticateIdToken,
  asyncHandler(async (req, res) => {
    const { id } = req.user;
    const member = new CommunityMember({ member: id, community: req.params.community_id });

    const createdMember = await member.save();
    res.status(200).json({ member: createdMember, success: "You successfully joined the community!" });
  })
);

router.delete(
  "/:community_id/members/:member_id",
  authenticateIdToken,
  checkCommunityMemberOwnership,
  asyncHandler(async (req, res) => {
    await req.doc.remove();
    res.status(200).json({ docId: req.params.member_id });
  })
);

export default router;
