// utils/storageUtils.js

// Function to get the company name from localStorage
export const getCompanyName = () => {
  return localStorage.getItem("companyName");
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
