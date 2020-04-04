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
export const appendVotes = async (data, type) => {
  // construct the querystring
  let queryString = "?";
  for (let d of data) {
    queryString += `ids=${d._id}&`
  }
  queryString = queryString.slice(0, -1);

  // send get request for votes
  const res = await requestProtectedResource({ method: "GET", path: `/votes/${type}s${queryString}` });
  if (res.status !== 200) return data;
  const voteData = await res.json();

  // create votes map
  const votesMap = new Map();
  for (let voteD of voteData[`${type}Votes`]) {
    votesMap.set(voteD[type], voteD["vote"]);
  }

  return data.map(doc => {
    if (!votesMap.get(doc._id)) return doc;
    doc["userVote"] = votesMap.get(doc._id);
    return doc;
  })
}