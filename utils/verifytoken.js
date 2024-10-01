// localStorageService.js

export const setAuthData = ({
  token,
  Userusername,
  UserActive,
  companyName,
  role,
}) => {
  localStorage.setItem("token", token);
  localStorage.setItem("Userusername", Userusername);
  localStorage.setItem("UserActive", UserActive);
  localStorage.setItem("companyName", companyName);
  localStorage.setItem("role", role);
};

export const getAuthData = () => {
  return {
    token: localStorage.getItem("token"),
    Userusername: localStorage.getItem("Userusername"),
    UserActive: localStorage.getItem("UserActive"),
    companyName: localStorage.getItem("companyName"),
    role: localStorage.getItem("role"),
  };
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null;
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("Userusername");
  localStorage.removeItem("UserActive");
  localStorage.removeItem("companyName");
  localStorage.removeItem("role");
};
