import React from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";

let setTokensFromUrl = async () => {
  const search = window.location.search.substring(1);
  if (!search) {
    return;
  }
  const query = JSON.parse(
    '{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
  console.log("Query", query);
  let tokens;
  if (query.code) {
    tokens = fetch(
      `https://www.strava.com/oauth/token?client_id=41833&client_secret=3017d913766ccf81c8d716c0a40a961b35488aea&code=${query.code}&grant_type=authorization_code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: data.expires_at,
        };
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  return tokens;
};

const HandleRedirect = () => {
  const [cookies, setCookie] = useCookies([]);
  React.useEffect(() => {
    setTokensFromUrl().then((value) => {
      if (!value) {
        return;
      }
      setCookie("access_token", value.accessToken, {
        path: "/",
        maxAge: 604800,
      });
      setCookie("refresh_token", value.refreshToken, {
        path: "/",
        maxAge: 604800,
      });
      setCookie("expires_at", value.expiresAt, {
        path: "/",
        maxAge: 604800,
      });
    });
  }, [setCookie]);
  console.log("Cookies", cookies);

  // Use reresh_token to obtain new access token when it expires
  const currentTime = Date.now() / 1000;
  if (cookies.expires_at < currentTime) {
    console.log("Access Token Expired! Refreshing...");
    const newTokens = fetch(
      `https://www.strava.com/oauth/token?client_id=41833&client_secret=3017d913766ccf81c8d716c0a40a961b35488aea&refresh_token=${cookies.refresh_token}&grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("New Tokens: ", newTokens);
    return <Redirect to="/token"></Redirect>;
  }
  return <Redirect to="/dashboard"></Redirect>;
};

export default HandleRedirect;
