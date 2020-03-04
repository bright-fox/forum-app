import CommunityMember from "../models/communityMember";
import GrowingCommunity from "../models/growingCommunity";
import moment from "moment";

export const updateGrowingCommunitiesList = async () => {
  // get date from one week ago
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const oneWeekAgo = new Date(Date.now() - oneWeek);

  // aggregate the communities
  const community = await CommunityMember.aggregate([
    { $match: { createdAt: { $gte: oneWeekAgo } } },
    { $group: { _id: "$community", count: { $sum: 1 } } },
    {
      $project: { _id: 0, community: "$_id", count: 1 }
    },
    { $sort: { count: -1 } }
  ]);

  // save them in growing community collection
  for (let i = 0; i < community.length; i++) {
    // add rank of community based on count
    community[i].rank = i + 1;
    // create growing community entry
    const growingCommunity = new GrowingCommunity(community[i]);
    await growingCommunity.save();
  }
};
