const {
  VITE_GOOGLE_SCOPE: GOOGLE_SCOPE,
  VITE_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  VITE_GOOGLE_REDIRECT_URI: GOOGLE_REDIRECT_URI,
  VITE_GOOGLE_OAUTH2_ENDPOINT: GOOGLE_OAUTH2_ENDPOINT,
} = import.meta.env;

/*
 * Create form to request access token from Google's JS client library.
 * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow?hl=es-419
 */
export function oauthSignInJS(): void {
  if (!GOOGLE_REDIRECT_URI || !GOOGLE_SCOPE || !GOOGLE_OAUTH2_ENDPOINT || !GOOGLE_CLIENT_ID) {
    throw new Error("Missing environment variables");
  }

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  const form: HTMLFormElement = document.createElement("form");
  form.setAttribute("target", "_blank"); // _blank|self
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", GOOGLE_OAUTH2_ENDPOINT);

  // Parameters to pass to OAuth 2.0 endpoint.
  const params: { [key: string]: string } = {
    scope: GOOGLE_SCOPE,
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "token",
    state: "pass-through value",
    include_granted_scopes: "true",
  };

  // Add form parameters as hidden input values.
  for (const p in params) {
    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);

    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

/*
 * Revoke OAuth2 access token from the Google JS client library.
 * @param token - The OAuth2 access token.
 * @returns Promise<void>
 * https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow?hl=es-419
 */

export function revokeAuthTokenJS(token: string): Promise<void> {
  const url = new URL("https://accounts.google.com/o/oauth2/revoke");
  url.searchParams.append("token", token);
  return new Promise((resolve, reject) => {
    fetch(url.toString(), { method: "GET" }).then((response) => {
      if (response.ok) {
        resolve();
      } else {
        reject(new Error("Failed to revoke token"));
      }
    });
  });
}

/*
 * Open a popup window to request OAuth2 access token from Google.
 */
export async function oauthPopup(): Promise<void> {
  const url = new URL(GOOGLE_OAUTH2_ENDPOINT);
  if (!GOOGLE_REDIRECT_URI || !GOOGLE_SCOPE || !GOOGLE_OAUTH2_ENDPOINT || !GOOGLE_CLIENT_ID) {
    throw new Error("Missing environment variables");
  }

  url.searchParams.append("scope", GOOGLE_SCOPE);
  url.searchParams.append("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.append("redirect_uri", GOOGLE_REDIRECT_URI);
  url.searchParams.append("response_type", "token");
  url.searchParams.append("include_granted_scopes", "true");
  url.searchParams.append("state", "state_parameter_passthrough_value");

  await chrome.windows.create({
    url: url.toString(),
    type: "popup", //  "normal" | "panel" | "popup"
    // height: 600,
    // width: 500,
  });
}

/*
 * Open a popup window to request OAuth2 access token from Google.
 */
export const oauthLogin = async (loginType: "popup" | "js") => {
  return loginType === "popup" ? await oauthPopup() : oauthSignInJS();
};
