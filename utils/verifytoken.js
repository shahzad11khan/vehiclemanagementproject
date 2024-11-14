// localStorageService.js

export const getAuthData = () => {
  return {
    token: localStorage.getItem("token"),
    Userusername: localStorage.getItem("Userusername"),
    companyName: localStorage.getItem("companyName"),
    userId: localStorage.getItem("userId"),
    UserActive: localStorage.getItem("UserActive"),
    role: localStorage.getItem("role"),
    companyID: localStorage.getItem("companyID"),
    flag: localStorage.getItem("flag"),
    Iscompanyselected: localStorage.getItem("Iscompanyselecteds"),
  };
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null;
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("Userusername");
  localStorage.removeItem("companyname");
  localStorage.removeItem("userId");
  localStorage.removeItem("UserActive");
  localStorage.removeItem("companyName");
  localStorage.removeItem("role");
  localStorage.removeItem("companyID");
  localStorage.removeItem("flag");
  localStorage.removeItem("Iscompanyselected");
};
