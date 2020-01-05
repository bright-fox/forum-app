export const baseApiURL = "http://localhost:4000";

export const request = async ({ method, path, body, token }) => {
  let headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(baseApiURL + path, { method, headers, body: JSON.stringify(body) });
  return res;
};

export const requestToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  return await fetch(`${baseApiURL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
};
