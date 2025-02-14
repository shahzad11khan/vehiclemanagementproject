// api.js
import axios from "axios";
// API`S
import { API_URL_USER, API_URL_Driver } from "../ApiUrls.js";

export const GetUserscount = () => {
  let companyName = "";

  if (typeof window !== "undefined") {
    // Only access localStorage in the browser environment
    companyName = localStorage.getItem("companyName") || ""; // Default to an empty string if not found
  }
  
  console.log("Retrieved company name:", companyName);
  
  return axios
    .get(`${API_URL_USER}`)
    .then((res) => {
      // Filter users by matching the company name
      const filteredUsers = res.data.result.filter(
        (user) => user.companyname === companyName
      );

      // console.log("user count : ", filteredUsers.length);
      // Return the filtered users and their count
      return { result: filteredUsers, count: filteredUsers.length };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};

export const GetDrivercount = () => {
  const companyName = localStorage.getItem("companyName"); // Get the company name from local storage

  return axios
    .get(`${API_URL_Driver}`)
    .then((res) => {
      // Filter drivers by matching the company name
      const filteredDrivers = res.data.Result.filter(
        (driver) => driver.adminCompanyName === companyName
      );

      // Return the filtered drivers and their count
      return { result: filteredDrivers, count: filteredDrivers.length };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};

export const GetVehiclecount = () => {
  return axios
    .get(`${API_URL_Vehicle}`)
    .then((res) => {
      const filteredVehicle = res.data.Result.filter(
        (driver) => driver.adminCompanyName === companyName
      );

      // Return the filtered drivers and their count
      return { result: filteredVehicle, count: filteredVehicle.length };
    })
    .catch((error) => {
      console.log(`error : ${error}`);
      throw error;
    });
};
