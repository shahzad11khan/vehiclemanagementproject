// // localStorageService.js

// export const getAuthData = () => {
//   return {
//     token: localStorage.getItem("token"),
//     Userusername: localStorage.getItem("Userusername"),
//     companyName: localStorage.getItem("companyName"),
//     userId: localStorage.getItem("userId"),
//     UserActive: localStorage.getItem("UserActive"),
//     role: localStorage.getItem("role"),
//     companyID: localStorage.getItem("companyID"),
//     flag: localStorage.getItem("flag"),
//     Iscompanyselected: localStorage.getItem("Iscompanyselecteds"),
//   };
// };

// export const isAuthenticated = () => {
//   const token = localStorage.getItem("token");
//   return token !== null;
// };


// export const clearAuthData = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("Userusername");
//   localStorage.removeItem("companyname");
//   localStorage.removeItem("userId");
//   localStorage.removeItem("UserActive");
//   localStorage.removeItem("companyName");
//   localStorage.removeItem("role");
//   localStorage.removeItem("companyID");
//   localStorage.removeItem("flag");
//   localStorage.removeItem("Iscompanyselected");
//   localStorage.removeItem("companyId");
// };

// localStorageService.js

export const getAuthData = () => {
  if (typeof window !== "undefined") {
    return {
      token: localStorage.getItem("token"),
      Userusername: localStorage.getItem("Userusername"),
      companyName: localStorage.getItem("companyName"),
      userId: localStorage.getItem("userId"),
      UserActive: localStorage.getItem("UserActive"),
      role: localStorage.getItem("role"),
      companyID: localStorage.getItem("companyID"),
      flag: localStorage.getItem("flag"),
      Iscompanyselected: localStorage.getItem("Iscompanyselected"), // Fixed the key name
    };
  }
  return {}; // Return an empty object if window is undefined
};

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return token !== null;
  }
  return false;
};

export const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("Userusername");
    localStorage.removeItem("companyName"); // Fixed the key name to match getAuthData
    localStorage.removeItem("userId");
    localStorage.removeItem("UserActive");
    localStorage.removeItem("role");
    localStorage.removeItem("companyID");
    localStorage.removeItem("flag");
    localStorage.removeItem("Iscompanyselected");
    localStorage.removeItem("companyId");
  }
};
