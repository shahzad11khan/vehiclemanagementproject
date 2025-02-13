// // utils/storageUtils.js

// // Function to get the company name from localStorage
// export const getCompanyName = () => {
//   return localStorage.getItem("companyName");
// };
// export const getsuperadmincompanyname = () => {
//   return localStorage.getItem("companyname");
// };
// export const getUserId = () => {
//   return localStorage.getItem("userId");
// };
// export const getcompanyId = () => {
//   return localStorage.getItem("companyID");
// };
// export const getUserName = () => {
//   return localStorage.getItem("Userusername");
// };
// export const getUserRole = () => {
//   return localStorage.getItem("role");
// };
// export const getflag = () => {
//   return localStorage.getItem("flag");
// };
// export const getIscompanyselected = () => {
//   return localStorage.getItem("Iscompanyselected");
// };

// // Function to get the company ID from localStorage
// export const getCompanyId = () => {
//   return localStorage.getItem("companyID");
// };

// // Function to set company details (if needed)
// export const setCompanyDetails = (companyName) => {
//   localStorage.setItem("companyName", companyName);
//   //   localStorage.setItem("companyId", companyId);
// };

// utils/storageUtils.js

// Function to get the company name from localStorage
export const getCompanyName = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("companyName");
  }
  return null;
};

export const getsuperadmincompanyname = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("companyname");
  }
  return null;
};

export const getUserId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId");
  }
  return null;
};

export const getcompanyId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("companyID");
  }
  return null;
};

export const getUserName = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("Userusername");
  }
  return null;
};

export const getUserRole = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role");
  }
  return null;
};

export const getflag = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("flag");
  }
  return null;
};

export const getIscompanyselected = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("Iscompanyselected");
  }
  return null;
};

// Function to get the company ID from localStorage
export const getCompanyId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("companyID");
  }
  return null;
};

// Function to set company details (if needed)
export const setCompanyDetails = (companyName) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("companyName", companyName);
  }
};
