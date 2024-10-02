// services/taxiFirmService.js
import axios from "axios";
import {
  API_URL_Firm,
  API_URL_Badge,
  API_URL_Insurence,
  API_URL_Payment,
  API_URL_LocalAuthority,
  API_URL_Title,
} from "../../../Components/ApiUrl/ApiUrls";
// Fetch all taxi firms
export const fetchTitle = async () => {
  try {
    const response = await axios.get(API_URL_Title);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi firms:", error);
    throw error;
  }
};
export const fetchTaxiFirms = async () => {
  try {
    const response = await axios.get(API_URL_Firm);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi firms:", error);
    throw error;
  }
};
export const fetchBadge = async () => {
  try {
    const response = await axios.get(API_URL_Badge);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi firms:", error);
    throw error;
  }
};
export const fetchInsurence = async () => {
  try {
    const response = await axios.get(API_URL_Insurence);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi firms:", error);
    throw error;
  }
};
export const fetchPayment = async () => {
  try {
    const response = await axios.get(API_URL_Payment);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi firms:", error);
    throw error;
  }
};
export const fetchLocalAuth = async () => {
  try {
    const response = await axios.get(API_URL_LocalAuthority);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi firms:", error);
    throw error;
  }
};
