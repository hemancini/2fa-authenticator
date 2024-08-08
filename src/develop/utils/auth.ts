export const getAuthStorage = async (): Promise<{
  token: string | undefined;
}> => {
  const entriesStorage = await chrome.storage.session.get(["auth"]);
  const data = entriesStorage["auth"];
  const parse = JSON.parse(data);
  if (!parse?.json?.state) return { token: undefined };

  const auth = parse.json.state;
  // console.log("auth:", auth);
  return auth;
};

export const setAuthStorage = async (token: string) => {
  const data = JSON.stringify({ json: { state: { token } } });
  await chrome.storage.session.set({ auth: data });
};
