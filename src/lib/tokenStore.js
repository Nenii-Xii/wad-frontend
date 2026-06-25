let _accessToken = null;

export const TokenStore = {
  getAccessToken: () => _accessToken,
  setAccessToken: (token) => { _accessToken = token; },
  
  getRefreshToken: () => sessionStorage.getItem("rf_token"),
  setRefreshToken: (token) => sessionStorage.setItem("rf_token", token),
  
  clear: () => {
    _accessToken = null;
    sessionStorage.removeItem("rf_token");
  },
  
  isLoggedIn: () => !!sessionStorage.getItem("rf_token"),
};