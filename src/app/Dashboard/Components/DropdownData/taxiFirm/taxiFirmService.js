// services/taxiFirmService.js
import axios from "axios";
import {
  API_URL_Firm,
  API_URL_Badge,
  API_URL_Insurence,
  API_URL_Payment,
  API_URL_LocalAuthority,
  API_URL_Title,
  API_URL_Manufacturer,
  API_URL_Vehicle,
  API_URL_Signature,
  API_URL_Transmission,
  API_URL_FuelType,
  API_URL_Type,
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
export const fetchVehicle = async () => {
  try {
    const response = await axios.get(API_URL_Vehicle);
    return response.data;
  } catch (error) {
    console.error("Error fetching Vehicle:", error);
    throw error;
  }
};
export const fetchManfacturer = async () => {
  try {
    const response = await axios.get(API_URL_Manufacturer);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi Manufacturer:", error);
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
    console.error("Error fetching Badge:", error);
    throw error;
  }
};
export const fetchInsurence = async () => {
  try {
    const response = await axios.get(API_URL_Insurence);
    return response.data;
  } catch (error) {
    console.error("Error fetching  Insurence:", error);
    throw error;
  }
};
export const fetchPayment = async () => {
  try {
    const response = await axios.get(API_URL_Payment);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi Payment:", error);
    throw error;
  }
};
export const fetchLocalAuth = async () => {
  try {
    const response = await axios.get(API_URL_LocalAuthority);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi LocalAuthority:", error);
    throw error;
  }
};
export const fetchSignature = async () => {
  try {
    const response = await axios.get(API_URL_Signature);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi Signature:", error);
    throw error;
  }
};

export const fetchTransmission = async () => {
  try {
    const response = await axios.get(API_URL_Transmission);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi Transmission:", error);
    throw error;
  }
};
export const fetchType = async () => {
  try {
    const response = await axios.get(API_URL_Type);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi Type:", error);
    throw error;
  }
};
export const fetchFuelType = async () => {
  try {
    const response = await axios.get(API_URL_FuelType);
    return response.data;
  } catch (error) {
    console.error("Error fetching taxi FuelType:", error);
    throw error;
  }
};
