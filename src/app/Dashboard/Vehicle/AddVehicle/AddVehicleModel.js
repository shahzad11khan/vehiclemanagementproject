"use client";
import { API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import SafetyFeaturesDropdown from "../SafetyFeaturesDropdown";
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
    safetyFeatures: [],
    techFeatures: "",
    towingCapacity: "",
    price: "",
    registrationNumber: "",
    warrantyInfo: "",
    adminCreatedBy: "",
    adminCompanyName: "",
    isActive: "",
    imageFile: null,
  });

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    const storedSuperadmin = localStorage.getItem("role");
    if (storedCompanyName) {
      setVehicleData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
    const fetchData = async () => {
      try {
        const localAuthData = await fetchLocalAuth();
        const manufacturerData = await fetchManfacturer();
        const transmission = await fetchTransmission();
        const type = await fetchType();
        const fueltype = await fetchFuelType();
        const currentCompanyName =
          vehicleData.adminCompanyName || storedCompanyName;
        const filteredLocalAuth =
          storedSuperadmin === "superadmin"
            ? localAuthData.Result
            : localAuthData.Result.filter(
                (localAuth) =>
                  localAuth.adminCompanyName === currentCompanyName ||
                  localAuth.adminCompanyName === "superadmin"
              );
        const filteredManufacturer =
          storedSuperadmin === "superadmin"
            ? manufacturerData.Result
            : manufacturerData.Result.filter(
                (manufacturer) =>
                  manufacturer.adminCompanyName === currentCompanyName ||
                  manufacturer.adminCompanyName === "superadmin"
              );
        const filteredtransmission =
          storedSuperadmin === "superadmin"
            ? transmission.Result
            : transmission.Result.filter(
                (transmission) =>
                  transmission.adminCompanyName === currentCompanyName ||
                  transmission.adminCompanyName === "superadmin"
              );
        const filteredtype =
          storedSuperadmin === "superadmin"
            ? type.Result
            : type.Result.filter(
                (type) =>
                  type.adminCompanyName === currentCompanyName ||
                  type.adminCompanyName === "superadmin"
              );
        const filteredfueltype =
          storedSuperadmin === "superadmin"
            ? fueltype.Result
            : fueltype.Result.filter(
                (fueltype) =>
                  fueltype.adminCompanyName === currentCompanyName ||
                  fueltype.adminCompanyName === "superadmin"
              );

        setLocal(filteredLocalAuth);
        setManufacturer(filteredManufacturer);
        setTransmission(filteredtransmission);
        setType(filteredtype);
        setFuelType(filteredfueltype);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [vehicleData.adminCompanyName]);
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

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
      const response = await axios.post(`${API_URL_Vehicle}`, vehicleData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
        onClose();
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
          safetyFeatures: [],
          techFeatures: "",
          towingCapacity: "",
          price: "",
          registrationNumber: "",
          warrantyInfo: "",
          adminCreatedBy: "",
          adminCompanyName: vehicleData.adminCompanyName,
          isActive: "",
          imageFile: null,
        });
      } else {
        console.log(response.data);
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error submitting vehicle data:", error);
    }
  };
  if (!isOpen) return null;

  const handleCheckboxChange = (option) => {
    setVehicleData((prevData) => {
      const currentFeatures = prevData.safetyFeatures;
      if (currentFeatures.includes(option)) {
        return {
          ...prevData,
          safetyFeatures: currentFeatures.filter(
            (feature) => feature !== option
          ),
        };
      } else {
        return {
          ...prevData,
          safetyFeatures: [...currentFeatures, option],
        };
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Vehicle Form</h2>

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

          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            <div className="">
              <div className="flex gap-1">
                <label className="block font-semibold">Body Type</label>
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

          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Height</label>
              </div>
              <input
                type="number"
                name="height"
                value={vehicleData.dimensions.height}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Width</label>
              </div>
              <input
                type="number"
                name="width"
                value={vehicleData.dimensions.width}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Length</label>
              </div>
              <input
                type="number"
                name="length"
                value={vehicleData.dimensions.length}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
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
              <div className="flex gap-1">
                <label className="block font-semibold">Cargo Capacity</label>
              </div>
              <input
                type="text"
                name="cargoCapacity"
                value={vehicleData.cargoCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Horsepower</label>
              </div>
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
              <div className="flex gap-1">
                <label className="block font-semibold">Torque</label>
              </div>
              <input
                type="number"
                name="torque"
                value={vehicleData.torque}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Top Speed (mph)</label>
              </div>
              <input
                type="number"
                name="topSpeed"
                value={vehicleData.topSpeed}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">
                  Towing Capacity (lbs)
                </label>{" "}
              </div>

              <input
                type="number"
                name="towingCapacity"
                value={vehicleData.towingCapacity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Fuel Efficiency</label>
              </div>

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
              {/* <div className="flex gap-1">
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
              /> */}
              <div className="flex gap-1">
                <label className="block font-semibold">Safety Features</label>
                <span className="text-red-600">*</span>
              </div>
              <div className="flex gap-1">
                {/* <label className="block font-semibold">Safety Features</label>
                <span className="text-red-600">*</span>
              </div>
              <select
                name="safetyFeatures"
                value={vehicleData.safetyFeatures}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                multiple
                required
              >
                <option value="" disabled>
                  Select safety features
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
              </select> */}
                <SafetyFeaturesDropdown
                  vehicleData={vehicleData}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Price (£)</label>

                <span className="text-red-600">*</span>
              </div>
              <input
                type="number"
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
                <label htmlFor="taxiFirm" className="block font-semibold">
                  Taxi Local Authority:
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
          <div>
            <h3 className="text-xl font-semibold mb-2">Vehicle Images</h3>

            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={handleChange}
              className="block w-full mt-1 mb-2"
            />
            {/* <input
              type="text"
              id="imageName"
              name="imageName"
              value={vehicleData.imageName}
              onChange={handleChange}
              placeholder="Image Name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            /> */}
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
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50">
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
