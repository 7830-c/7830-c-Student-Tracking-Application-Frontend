const ACCESS_TOKEN_KEY = "sure_access_token";
const REFRESH_TOKEN_KEY = "sure_refresh_token";
const USER_INFO_KEY = "sure_user_info";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

export const getUserInfo = () => {
  const data = localStorage.getItem(USER_INFO_KEY);
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const setUserInfo = (user) => localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
export const removeUserInfo = () => localStorage.removeItem(USER_INFO_KEY);

export const clearAuthStorage = () => {
  removeAccessToken();
  removeRefreshToken();
  removeUserInfo();
};

export const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
