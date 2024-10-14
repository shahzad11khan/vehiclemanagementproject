"use client";
import { API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  fetchLocalAuth,
  fetchManfacturer,
  fetchTransmission,
  fetchType,
  fetchFuelType,
} from "../../Components/DropdownData/taxiFirm/taxiFirmService";

const AddVehicleModel = ({ isOpen, onClose, fetchData }) => {
  const [local, setLocal] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [transmission, setTransmission] = useState([]);
  const [type, setType] = useState([]);
  const [fueltype, setFuelType] = useState([]);
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
    isActive: "",
  });

  // Fetch data and company name on component mount
  useEffect(() => {
    // Retrieve company name and superadmin role from local storage
    const storedCompanyName = localStorage.getItem("companyName");
    const storedSuperadmin = localStorage.getItem("role");

    // Update vehicle data with the adminCompanyName if available
    if (storedCompanyName) {
      setVehicleData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }

    // Fetch local authorities and manufacturers
    const fetchData = async () => {
      try {
        const localAuthData = await fetchLocalAuth();
        const manufacturerData = await fetchManfacturer();
        const transmission = await fetchTransmission();
        const type = await fetchType();
        const fueltype = await fetchFuelType();

        // Use the latest adminCompanyName from vehicleData
        const currentCompanyName =
          vehicleData.adminCompanyName || storedCompanyName;

        // Filter local authorities based on the user's role
        const filteredLocalAuth =
          storedSuperadmin === "superadmin"
            ? localAuthData.Result // No filtering for superadmins
            : localAuthData.Result.filter(
                (localAuth) =>
                  localAuth.adminCompanyName === currentCompanyName ||
                  localAuth.adminCompanyName === "superadmin"
              );

        // Filter manufacturer data based on the user's role
        const filteredManufacturer =
          storedSuperadmin === "superadmin"
            ? manufacturerData.Result // No filtering for superadmins
            : manufacturerData.Result.filter(
                (manufacturer) =>
                  manufacturer.adminCompanyName === currentCompanyName ||
                  manufacturer.adminCompanyName === "superadmin"
              );
        // Filter transmission data based on the user's role
        const filteredtransmission =
          storedSuperadmin === "superadmin"
            ? transmission.Result // No filtering for superadmins
            : transmission.Result.filter(
                (transmission) =>
                  transmission.adminCompanyName === currentCompanyName ||
                  transmission.adminCompanyName === "superadmin"
              );
        // Filter type data based on the user's role
        const filteredtype =
          storedSuperadmin === "superadmin"
            ? type.Result // No filtering for superadmins
            : type.Result.filter(
                (type) =>
                  type.adminCompanyName === currentCompanyName ||
                  type.adminCompanyName === "superadmin"
              );
        // Filter type data based on the user's role
        const filteredfueltype =
          storedSuperadmin === "superadmin"
            ? fueltype.Result // No filtering for superadmins
            : fueltype.Result.filter(
                (fueltype) =>
                  fueltype.adminCompanyName === currentCompanyName ||
                  fueltype.adminCompanyName === "superadmin"
              );

        // Update local and manufacturer states
        setLocal(filteredLocalAuth);
        setManufacturer(filteredManufacturer);
        // console.log("transmission", transmission);
        setTransmission(filteredtransmission);
        // console.log("bodytype", type);
        setType(filteredtype);
        // console.log("fueltype", fueltype);
        setFuelType(filteredfueltype);
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Failed to fetch data, please try again.");
      }
    };

    fetchData();
  }, []); // Run only once when the component mounts

  // Handle input changes for vehicleData
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update state based on input type
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value, // Use checked for checkboxes, value for other input types
    }));
  };

  // Handle changes for vehicle dimensions
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL_Vehicle}`, vehicleData);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchData(); // Refresh parent component data
        onClose(); // Close modal
        setVehicleData({
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
          adminCompanyName: vehicleData.adminCompanyName, // Preserve company name
          isActive: "",
        });
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error submitting vehicle data:", error);
    }
  };

  // If the modal is not open, do not render
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Vehicle Form</h2>

          {/* Manufacturer and Model */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Manufacturer</label>
                <span className="text-red-600">*</span>
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
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Model</label>
                <span className="text-red-600">*</span>
              </div>
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
              <div className="flex gap-1">
                <label className="block font-semibold">Year</label>
                <span className="text-red-600">*</span>
              </div>
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

          {/* Year and Type/Body Style */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            <div className="">
              <div className="flex gap-1">
                <label className="block font-semibold">Type/Body Style</label>
                <span className="text-red-600">*</span>
              </div>

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
              <div className="flex gap-1">
                <label className="block font-semibold">Engine Type</label>
                <span className="text-red-600">*</span>
              </div>
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
              <div className="flex gap-1">
                <label className="block font-semibold">Fuel Type</label>
                <span className="text-red-600">*</span>
              </div>
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

          {/* Engine Type, Fuel Type, Transmission, Drivetrain */}
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Transmission</label>
                <span className="text-red-600">*</span>
              </div>
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
              <div className="flex gap-1">
                <label className="block font-semibold">Drivetrain</label>
                <span className="text-red-600">*</span>
              </div>
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
              <div className="flex gap-1">
                <label className="block font-semibold">Exterior Color</label>
                <span className="text-red-600">*</span>
              </div>
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
              <div className="flex gap-1">
                <label className="block font-semibold">Interior Color</label>
                <span className="text-red-600">*</span>
              </div>
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

          {/* Colors */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4"></div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Height</label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="number"
                name="height"
                value={vehicleData.dimensions.height}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Width</label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="number"
                name="width"
                value={vehicleData.dimensions.width}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Length</label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="number"
                name="length"
                value={vehicleData.dimensions.length}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">
                  Passenger Capacity
                </label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="number"
                name="passengerCapacity"
                value={vehicleData.passengerCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Cargo Capacity</label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="text"
                name="cargoCapacity"
                value={vehicleData.cargoCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Horsepower</label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="text"
                name="horsepower"
                value={vehicleData.horsepower}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* Horsepower and Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Torque</label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="text"
                name="torque"
                value={vehicleData.torque}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Top Speed (mph)</label>
                <span className="text-red-600">*</span>
              </div>
              <input
                type="text"
                name="topSpeed"
                value={vehicleData.topSpeed}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">
                  Towing Capacity (lbs)
                </label>{" "}
                <span className="text-red-600">*</span>
              </div>

              <input
                type="text"
                name="towingCapacity"
                value={vehicleData.towingCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* Safety and Tech Features */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Fuel Efficiency</label>

                <span className="text-red-600">*</span>
              </div>

              <input
                type="text"
                name="fuelEfficiency"
                value={vehicleData.fuelEfficiency}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., 25 MPG"
                required
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Safety Features</label>

                <span className="text-red-600">*</span>
              </div>
              <textarea
                name="safetyFeatures"
                value={vehicleData.safetyFeatures}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Airbags, ABS, Stability Control"
                required
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">
                  Technology Features
                </label>

                <span className="text-red-600">*</span>
              </div>
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

          {/* Towing Capacity, Price, Registration Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Price ($)</label>

                <span className="text-red-600">*</span>
              </div>
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
              <div className="flex gap-1">
                <label className="block font-semibold">
                  Registration Number
                </label>

                <span className="text-red-600">*</span>
              </div>
              <input
                type="text"
                name="registrationNumber"
                value={vehicleData.registrationNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <div className="flex gap-1">
                <label
                  htmlFor="taxiFirm"
                  className="text-sm font-medium text-gray-700"
                >
                  Taxi Localauthority:
                </label>

                <span className="text-red-600">*</span>
              </div>
              <select
                id="LocalAuthority"
                name="LocalAuthority"
                value={vehicleData.LocalAuthority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Local Authority</option>
                {local.map((auth) => (
                  <option key={auth.id} value={auth.name}>
                    {auth.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Warranty Information */}
          <div className="mt-4">
            <div className="flex gap-1">
              <label className="block font-semibold">
                Warranty Information
              </label>

              <span className="text-red-600">*</span>
            </div>
            <textarea
              name="warrantyInfo"
              value={vehicleData.warrantyInfo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., 3 years or 36,000 miles"
              required
            />
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

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              // className="px-6 py-3 bg-blue-500 text-white rounded-lg"
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

export default AddVehicleModel;
