import jwt from "jsonwebtoken";
import CustomError from "../util/CustomError";
import { checkDocOwnership } from "../util";
import Community from "../models/community";
import CommunityMember from "../models/communityMember";

export const authenticateIdToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(new CustomError(401));

  jwt.verify(token, process.env.ID_TOKEN_SECRET, (err, user) => {
    if (err) return next(new CustomError(403, "Im"));
    req.user = user;
    next();
  });
};

export const checkCommunityOwnership = async (req, res, next) => {
  await checkDocOwnership(Community, req.params.community_id, req.user.id, "creator").catch(next);
  next();
};

export const checkCommunityMemberOwnership = async (req, res, next) => {
  await checkDocOwnership(CommunityMember, req.params.communitymember_id, req.user.id, "member").catch(next);
  next();
};
