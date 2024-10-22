"use client";
import { API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  fetchManfacturer,
  fetchLocalAuth,
  fetchTransmission,
  fetchType,
  fetchFuelType,
} from "../../Components/DropdownData/taxiFirm/taxiFirmService";

const UpdateVehicleModel = ({ isOpen, onClose, fetchData, vehicleId }) => {
  const [vehicleData, setVehicleData] = useState({
    manufacturer: "",
    model: "",
    year: "",
    type: "",
    engineType: "",
    fuelType: "",
    transmission: "",
    drivetrain: "",
    exteriorColor: "",
    interiorColor: "",
    weight: "",
    dimensions: {
      height: "",
      width: "",
      length: "",
    },
    passengerCapacity: "",
    LocalAuthority: "",
    cargoCapacity: "",
    vehicleStatus: "",
    horsepower: "",
    torque: "",
    acceleration: "",
    topSpeed: "",
    fuelEfficiency: "",
    safetyFeatures: "",
    techFeatures: "",
    towingCapacity: "",
    price: "",
    registrationNumber: "",
    warrantyInfo: "",
    adminCreatedBy: "",
    adminCompanyName: "",
    isActive: false,
  });

  const [superadmin, setSuperadmin] = useState(null);
  const [LocalAuthority, setLocalAuth] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);

  const [transmission, setTransmission] = useState([]);
  const [type, setType] = useState([]);
  const [fueltype, setFuelType] = useState([]);

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    const storedSuperadmin = localStorage.getItem("role");
    if (storedSuperadmin) {
      setSuperadmin(storedSuperadmin);
    }
    if (storedCompanyName) {
      setVehicleData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setVehicleData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const fetchDataForDropdowns = async () => {
      try {
        const storedCompanyName = vehicleData.adminCompanyName;
        const manufacturerResponse = await fetchManfacturer();
        const localauthResponse = await fetchLocalAuth();
        const transmission = await fetchTransmission();
        const type = await fetchType();
        const fueltype = await fetchFuelType();

        const filteredManufacturer =
          superadmin === "superadmin"
            ? manufacturerResponse.Result
            : manufacturerResponse.Result.filter(
                (manufacturer) =>
                  manufacturer.adminCompanyName === storedCompanyName ||
                  manufacturer.adminCompanyName === "superadmin"
              );
        const filteredLocalAuth =
          superadmin === "superadmin"
            ? localauthResponse.Result
            : localauthResponse.Result.filter(
                (localauth) =>
                  localauth.adminCompanyName === storedCompanyName ||
                  localauth.adminCompanyName === "superadmin"
              );
        const filteredtransmission =
          superadmin === "superadmin"
            ? transmission.Result
            : transmission.Result.filter(
                (transmission) =>
                  transmission.adminCompanyName === storedCompanyName ||
                  transmission.adminCompanyName === "superadmin"
              );
        const filteredtype =
          superadmin === "superadmin"
            ? type.Result
            : type.Result.filter(
                (type) =>
                  type.adminCompanyName === storedCompanyName ||
                  type.adminCompanyName === "superadmin"
              );
        const filteredfueltype =
          superadmin === "superadmin"
            ? fueltype.Result
            : fueltype.Result.filter(
                (fueltype) =>
                  fueltype.adminCompanyName === storedCompanyName ||
                  fueltype.adminCompanyName === "superadmin"
              );

        setManufacturer(filteredManufacturer);
        setLocalAuth(filteredLocalAuth);
        setTransmission(filteredtransmission);
        setType(filteredtype);
        setFuelType(filteredfueltype);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDataForDropdowns();
  }, [superadmin, vehicleData.adminCompanyName]);

  useEffect(() => {
    if (vehicleId) {
      const fetchVehicleData = async () => {
        try {
          const response = await axios.get(`${API_URL_Vehicle}/${vehicleId}`);
          setVehicleData(response.data.result);
          console.log("update value", response.data.result.dimensions.height);
        } catch (error) {
          console.error("Error fetching vehicle data:", error);
          toast.error("Failed to load vehicle data.");
        }
      };

      fetchVehicleData();
    }
  }, [vehicleId]);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      dimensions: {
        ...prevData.dimensions,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL_Vehicle}/${vehicleId}`,
        vehicleData
      );
      toast.success(response.data.message);
      fetchData();
      onClose();
    } catch (error) {
      console.error("Error updating vehicle data:", error);
      toast.error(
        error.response?.data?.error || "Failed to update vehicle data."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Vehicle Form</h2>
          {/* Manufacturer and Model */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Manufacturer</label>
              </div>
              <select
                id="manufacturer"
                name="manufacturer"
                value={vehicleData.manufacturer}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Manufacturer</option>
                {manufacturer.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold">Model</label>
              <input
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Camry, Mustang"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Year</label>
              <input
                type="number"
                name="year"
                value={vehicleData.year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., 2024"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            <div className="">
              <label className="block font-semibold">Type/Body Style</label>
              <select
                name="type"
                value={vehicleData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select type
                </option>
                {type.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold">Engine Type</label>
              <input
                type="text"
                name="engineType"
                value={vehicleData.engineType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., 2.5L 4-Cylinder"
                required
              />
            </div>
            <div className="">
              <label className="block font-semibold">Fuel Type</label>
              <select
                name="fuelType"
                value={vehicleData.fuelType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select fuel type
                </option>
                {fueltype.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
            <div>
              <label className="block font-semibold">Transmission</label>
              <select
                name="transmission"
                value={vehicleData.transmission}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Automatic"
                required
              >
                <option value="" disabled>
                  Select Transmission
                </option>
                {transmission.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <label className="block font-semibold">Drivetrain</label>
              <select
                name="drivetrain"
                value={vehicleData.drivetrain}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select drivetrain
                </option>
                <option value="FWD">Front-wheel drive (FWD)</option>
                <option value="RWD">Rear-wheel drive (RWD)</option>
                <option value="AWD">All-wheel drive (AWD)</option>
                <option value="4WD">Four-wheel drive (4WD)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Exterior Color</label>
              <input
                type="text"
                name="exteriorColor"
                value={vehicleData.exteriorColor}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Red, Blue"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Interior Color</label>
              <input
                type="text"
                name="interiorColor"
                value={vehicleData.interiorColor}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Black, Beige"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <label className="block font-semibold">Height (in cm)</label>
              <input
                type="number"
                name="height"
                value={vehicleData.dimensions.height}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block font-semibold">Width (in cm)</label>
              <input
                type="number"
                name="width"
                value={vehicleData.dimensions.width}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block font-semibold">Length (in cm)</label>
              <input
                type="number"
                name="length"
                value={vehicleData.dimensions.length}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">
                  Passenger Capacity
                </label>
                <span className="text-red-600">*</span>
              </div>
              <select
                name="passengerCapacity"
                value={vehicleData.passengerCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Capacity
                </option>
                {[...Array(10)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold">Cargo Capacity</label>
              <input
                type="text"
                name="cargoCapacity"
                value={vehicleData.cargoCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Horsepower</label>
              <input
                type="number"
                name="horsepower"
                value={vehicleData.horsepower}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <label className="block font-semibold">Torque</label>
              <input
                type="text"
                name="torque"
                value={vehicleData.torque}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">Top Speed (mph)</label>
              <input
                type="number"
                name="topSpeed"
                value={vehicleData.topSpeed}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold">
                Towing Capacity (lbs)
              </label>
              <input
                type="number"
                name="towingCapacity"
                value={vehicleData.towingCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            <div>
              <label className="block font-semibold">Fuel Efficiency</label>
              <input
                type="text"
                name="fuelEfficiency"
                value={vehicleData.fuelEfficiency}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., 25 MPG"
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Safety Features</label>
                <span className="text-red-600">*</span>
              </div>
              <select
                name="safetyFeatures"
                value={vehicleData.safetyFeatures}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select safety feature
                </option>
                <option value="Airbags">Airbags</option>
                <option value="ABS">ABS (Anti-lock Braking System)</option>
                <option value="Stability Control">Stability Control</option>
                <option value="Traction Control">Traction Control</option>
                <option value="Blind Spot Monitoring">
                  Blind Spot Monitoring
                </option>
                <option value="Lane Departure Warning">
                  Lane Departure Warning
                </option>
                <option value="Adaptive Cruise Control">
                  Adaptive Cruise Control
                </option>
                <option value="Rearview Camera">Rearview Camera</option>
                <option value="Parking Sensors">Parking Sensors</option>
                <option value="Automatic Emergency Braking">
                  Automatic Emergency Braking
                </option>
              </select>
            </div>
            <div>
              <label className="block font-semibold">Technology Features</label>
              <textarea
                name="techFeatures"
                value={vehicleData.techFeatures}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Navigation, Bluetooth, Backup Camera"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <label className="block font-semibold">Price ($)</label>
              <input
                type="text"
                name="price"
                value={vehicleData.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={vehicleData.registrationNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="">
              <label className="block font-semibold">Local Authority</label>
              <select
                name="LocalAuthority"
                value={vehicleData.LocalAuthority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select type
                </option>
                {LocalAuthority.map((authority) => (
                  <option key={authority.id} value={authority.name}>
                    {authority.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {/* Warranty Information Section */}
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <label className="block font-semibold">
                  Warranty Information
                </label>
                <span className="text-red-600">*</span>
              </div>
              <textarea
                name="warrantyInfo"
                value={vehicleData.warrantyInfo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded resize-none" // Added 'resize-none' for better layout control
                placeholder="e.g., 3 years or 36,000 miles"
                required
              />
            </div>

            {/* Vehicle Status Section */}
            <div className="flex flex-col mt-4">
              <div className="flex gap-1 items-center">
                <label className="block font-semibold">Vehicle Status</label>
                <span className="text-red-600">*</span>
              </div>
              <select
                name="vehicleStatus" // Change the name to match the new purpose
                value={vehicleData.vehicleStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select vehicle status
                </option>
                <option value="Available">Available</option>
                <option value="Sell">Sell</option>
                <option value="Pending">Pending</option>
                <option value="Rent">Rent</option>
                <option value="Maintenance">In Maintenance</option>
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={vehicleData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active
            </label>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 ml-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVehicleModel;
