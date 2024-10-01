"use client";
import { API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useState } from "react";

const AddVehicleModel = ({ isOpen, onClose, fetchData }) => {
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
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
    console.log(vehicleData);
    try {
      const response = await axios.post(`${API_URL_Vehicle}`, vehicleData);
      console.log("Vehicle data submitted successfully:", response.data);
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
        safetyFeatures: "",
        techFeatures: "",
        towingCapacity: "",
        price: "",
        registrationNumber: "",
        warrantyInfo: "",
      });
      // Handle success (you might want to clear the form, close the modal, etc.)
    } catch (error) {
      console.error("Error submitting vehicle data:", error);
      // Handle error (show an error message to the user, etc.)
    }
    // Submit logic here
  };
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
              <label className="block font-semibold">Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={vehicleData.manufacturer}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Toyota, Ford"
                required
              />
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

          {/* Year and Type/Body Style */}
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
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
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
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Engine Type, Fuel Type, Transmission, Drivetrain */}
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
            <div>
              <label className="block font-semibold">Transmission</label>
              <input
                type="text"
                name="transmission"
                value={vehicleData.transmission}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Automatic"
                required
              />
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

          {/* Colors */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4"></div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
            <div>
              <label className="block font-semibold">Height</label>
              <input
                type="text"
                name="height"
                value={vehicleData.dimensions.height}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Width</label>
              <input
                type="text"
                name="width"
                value={vehicleData.dimensions.width}
                onChange={handleDimensionChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Length</label>
              <input
                type="text"
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
              <label className="block font-semibold">Passenger Capacity</label>
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
              <label className="block font-semibold">Cargo Capacity</label>
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
              <label className="block font-semibold">Horsepower</label>
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
              <label className="block font-semibold">Torque</label>
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
              <label className="block font-semibold">Top Speed (mph)</label>
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
              <label className="block font-semibold">
                Towing Capacity (lbs)
              </label>
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
              <label className="block font-semibold">Fuel Efficiency</label>
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
              <label className="block font-semibold">Safety Features</label>
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

          {/* Towing Capacity, Price, Registration Number */}
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
                <option value="Sedan">A</option>
                <option value="SUV">B</option>
                <option value="Truck">C</option>
                <option value="Coupe">D</option>
              </select>
            </div>
          </div>

          {/* Warranty Information */}
          <div className="mt-4">
            <label className="block font-semibold">Warranty Information</label>
            <textarea
              name="warrantyInfo"
              value={vehicleData.warrantyInfo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="e.g., 3 years or 36,000 miles"
              required
            />
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
