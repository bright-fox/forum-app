export const baseApiURL = "http://localhost:4000";

export const request = async ({ method, path, body, token }) => {
  let headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(baseApiURL + path, { method, headers, body: JSON.stringify(body) });
  return res;
};

export const requestToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;
  const res = await fetch(`${baseApiURL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  if (res.status !== 200) return;
  return await res.json();
};

export const requestProtectedResource = async ({ method, path, body }) => {
  const tokenObj = await requestToken();
  if (!tokenObj) return;
  return await request({ method, path, body, token: tokenObj.idToken });
};

// appends the votes to either an array of posts or comments
export const appendVotes = async (docs, type) => {
  // construct the querystring from docs
  let queryString = "?";
  for (let doc of docs) {
    queryString += `ids=${doc._id}&`
  }
  queryString = queryString.slice(0, -1);

  // send get request for votes
  const res = await requestProtectedResource({ method: "GET", path: `/votes/${type}s${queryString}` });
  if (res.status !== 200) return docs;
  const data = await res.json();

  // create votes and votedId map
  const votesMap = new Map();
  const votesIdMap = new Map();
  for (let d of data[`${type}Votes`]) {
    votesMap.set(d[type], d["vote"]);
    votesIdMap.set(d[type], d["_id"]);
  }

  // return docs with appended vote
  return docs.map(doc => {
    if (!votesMap.get(doc._id)) return doc;
    doc["userVote"] = votesMap.get(doc._id);
    doc["userVoteId"] = votesIdMap.get(doc._id);
    return doc;
  })
}