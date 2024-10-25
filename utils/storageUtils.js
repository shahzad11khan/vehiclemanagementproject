// utils/storageUtils.js

// Function to get the company name from localStorage
export const getCompanyName = () => {
  return localStorage.getItem("companyName");
};
export const getsuperadmincompanyname = () => {
  return localStorage.getItem("companyname");
};
export const getUserId = () => {
  return localStorage.getItem("userId");
};
export const getUserName = () => {
  return localStorage.getItem("Userusername");
};
export const getUserRole = () => {
  return localStorage.getItem("role");
};
export const getflag = () => {
  return localStorage.getItem("flag");
};
export const getIscompanyselected = () => {
  return localStorage.getItem("Iscompanyselected");
};

// Function to get the company ID from localStorage
export const getCompanyId = () => {
  return localStorage.getItem("companyId");
};

// Function to set company details (if needed)
export const setCompanyDetails = (companyName) => {
  localStorage.setItem("companyName", companyName);
  //   localStorage.setItem("companyId", companyId);
};
