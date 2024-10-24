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

    height: "",
    width: "",
    length: "",
    passengerCapacity: "",
    LocalAuthority: "",
    cargoCapacity: "",
    horsepower: "",
    torque: "",
    topSpeed: "",
    fuelEfficiency: "",
    safetyFeatures: [],
    techFeatures: [],
    towingCapacity: "",
    price: "",
    registrationNumber: "",
    vehicleStatus: "",
    warrantyInfo: "",
    adminCreatedBy: "",
    adminCompanyName: "",
    isActive: false,
    imageFiles: [], // Store selected image files
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
        const transmissionData = await fetchTransmission();
        const typeData = await fetchType();
        const fueltypeData = await fetchFuelType();
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
        const filteredTransmission =
          storedSuperadmin === "superadmin"
            ? transmissionData.Result
            : transmissionData.Result.filter(
                (transmission) =>
                  transmission.adminCompanyName === currentCompanyName ||
                  transmission.adminCompanyName === "superadmin"
              );
        const filteredType =
          storedSuperadmin === "superadmin"
            ? typeData.Result
            : typeData.Result.filter(
                (type) =>
                  type.adminCompanyName === currentCompanyName ||
                  type.adminCompanyName === "superadmin"
              );
        const filteredFuelType =
          storedSuperadmin === "superadmin"
            ? fueltypeData.Result
            : fueltypeData.Result.filter(
                (fueltype) =>
                  fueltype.adminCompanyName === currentCompanyName ||
                  fueltype.adminCompanyName === "superadmin"
              );

        setLocal(filteredLocalAuth);
        setManufacturer(filteredManufacturer);
        setTransmission(filteredTransmission);
        setType(filteredType);
        setFuelType(filteredFuelType);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [vehicleData.adminCompanyName]);

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files } = e.target;
  //   setVehicleData((prevData) => ({
  //     ...prevData,
  //     [name]:
  //       type === "checkbox"
  //         ? checked
  //         : type === "file"
  //         ? Array.from(files)
  //         : value,
  //   }));
  // };

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files, options } = e.target;

  //   setVehicleData((prevData) => {
  //     // Handle multi-select dropdown
  //     if (type === "select-multiple") {
  //       const selectedValues = Array.from(options)
  //         .filter((option) => option.selected)
  //         .map((option) => option.value);

  //       return {
  //         ...prevData,
  //         [name]: selectedValues,
  //       };
  //     }

  //     // Handle file inputs
  //     if (type === "file") {
  //       return {
  //         ...prevData,
  //         [name]: Array.from(files), // Convert FileList to an array
  //       };
  //     }

  //     // Handle checkbox inputs
  //     if (type === "checkbox") {
  //       return {
  //         ...prevData,
  //         [name]: checked,
  //       };
  //     }

  //     // Handle regular inputs (text, radio, etc.)
  //     return {
  //       ...prevData,
  //       [name]: value,
  //     };
  //   });
  // };

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files, options } = e.target;

  //   setVehicleData((prevData) => {
  //     // Handle multi-select dropdown
  //     if (type === "select-multiple") {
  //       const selectedValues = Array.from(options)
  //         .filter((option) => option.selected)
  //         .map((option) => option.value);

  //       return {
  //         ...prevData,
  //         [name]: selectedValues,
  //       };
  //     }

  //     // Handle file inputs
  //     if (type === "file") {
  //       return {
  //         ...prevData,
  //         [name]: Array.from(files), // Convert FileList to an array
  //       };
  //     }

  //     // Handle checkbox inputs for safety features
  //     if (name === "safetyFeatures") {
  //       const currentSafetyFeatures = prevData[name] || [];
  //       if (checked) {
  //         // Add feature if checked
  //         return {
  //           ...prevData,
  //           [name]: [...currentSafetyFeatures, value], // Add selected feature
  //         };
  //       } else {
  //         // Remove feature if unchecked
  //         return {
  //           ...prevData,
  //           [name]: currentSafetyFeatures.filter(
  //             (feature) => feature !== value
  //           ), // Remove deselected feature
  //         };
  //       }
  //     }
  //     if (type === "checkbox") {
  //       return {
  //         ...prevData,
  //         [name]: checked,
  //       };
  //     }
  //     // Handle regular inputs (text, radio, etc.)
  //     return {
  //       ...prevData,
  //       [name]: value,
  //     };
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, type, checked, files, options } = e.target;

    setVehicleData((prevData) => {
      // Handle multi-select dropdown
      if (type === "select-multiple") {
        const selectedValues = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);

        return {
          ...prevData,
          [name]: selectedValues,
        };
      }

      // Handle file inputs
      if (type === "file") {
        return {
          ...prevData,
          [name]: Array.from(files), // Convert FileList to an array
        };
      }

      // Handle checkbox inputs for safety features
      if (name === "safetyFeatures") {
        const currentSafetyFeatures = prevData[name] || [];
        if (checked) {
          // Add feature if checked
          return {
            ...prevData,
            [name]: [...currentSafetyFeatures, value], // Add selected feature
          };
        } else {
          // Remove feature if unchecked
          return {
            ...prevData,
            [name]: currentSafetyFeatures.filter(
              (feature) => feature !== value
            ), // Remove deselected feature
          };
        }
      }

      // Handle checkbox inputs for technology features
      if (name === "techFeatures") {
        const currentTechFeatures = prevData.techFeatures || [];
        if (checked) {
          // Add feature if checked
          return {
            ...prevData,
            [name]: [...currentTechFeatures, value], // Add selected feature
          };
        } else {
          // Remove feature if unchecked
          return {
            ...prevData,
            [name]: currentTechFeatures.filter((feature) => feature !== value), // Remove deselected feature
          };
        }
      }

      // Handle regular checkbox inputs
      if (type === "checkbox") {
        // Set isActive specifically as a boolean
        return {
          ...prevData,
          [name]: checked, // This will now ensure isActive is a boolean
        };
      }

      // Handle regular inputs (text, radio, etc.)
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in vehicleData) {
      if (key === "imageFiles") {
        vehicleData.imageFiles.forEach((file) => {
          formData.append("imageFiles", file);
        });
      } else if (typeof vehicleData[key] === "object") {
        for (const subKey in vehicleData[key]) {
          formData.append(`${key}[${subKey}]`, vehicleData[key][subKey]);
        }
      } else {
        formData.append(key, vehicleData[key]);
      }
    }

    console.log(vehicleData);

    try {
      const response = await axios.post(API_URL_Vehicle, vehicleData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
        onClose();
        resetForm();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error submitting vehicle data:", error);
    }
  };

  const resetForm = () => {
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
      height: "",
      width: "",
      length: "",
      passengerCapacity: "",
      LocalAuthority: "",
      cargoCapacity: "",
      horsepower: "",
      torque: "",
      topSpeed: "",
      fuelEfficiency: "",
      safetyFeatures: [],
      techFeatures: [],
      towingCapacity: "",
      price: "",
      registrationNumber: "",
      vehicleStatus: "",
      warrantyInfo: "",
      adminCreatedBy: "",
      adminCompanyName: vehicleData.adminCompanyName,
      isActive: false,
      imageFiles: [], // Reset to an empty array
    });
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
                value={vehicleData.height}
                onChange={handleChange}
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
                value={vehicleData.width}
                onChange={handleChange}
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
                value={vehicleData.length}
                onChange={handleChange}
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

          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-4">
            <div>
              <div className="flex gap-1">
                <label className="block font-semibold">Safety Features</label>
                <span className="text-red-600">*</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-1  border border-gray-300 pl-1">
                {/* List of safety features as checkboxes */}
                {[
                  "Airbags",
                  "ABS",
                  "Stability Control",
                  "Traction Control",
                  "Blind Spot Monitoring",
                  "Lane Departure Warning",
                  "Adaptive Cruise Control",
                  "Rearview Camera",
                  "Parking Sensors",
                  "Automatic Emergency Braking",
                ].map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      name="safetyFeatures"
                      value={feature}
                      checked={vehicleData.safetyFeatures.includes(feature)}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>
            <div className="">
              <div className="flex gap-1 ">
                <label className="block font-semibold">
                  Technology Features
                </label>
                <span className="text-red-600">*</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-1.5 border border-gray-300 pl-1">
                {/* List of technology features as checkboxes */}
                {[
                  "Navigation",
                  "Bluetooth",
                  "Backup Camera",
                  "Adaptive Headlights",
                  "Lane Keep Assist",
                  "Parking Assist",
                  "Smartphone Integration",
                  "Voice Recognition",
                  "Keyless Entry",
                  "Rear Seat Entertainment",
                ].map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      name="techFeatures"
                      value={feature}
                      checked={vehicleData.techFeatures.includes(feature)}
                      onChange={handleChange}
                      className="mr-1"
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
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

            {/* Vehicle Status Section */}
            <div className="">
              <div className="flex gap-1">
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
                <option value="Sale">Sell</option>
                <option value="Standby">Standby</option>
                <option value="Rent">Rent</option>
                <option value="Maintenance">Maintenance</option>
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
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Vehicle Images</h3>
            <div>
              <input
                type="file"
                id="imageFiles"
                name="imageFiles"
                onChange={handleChange}
                className="block w-full mt-1 mb-2"
                placeholder="select 10 images"
                multiple
              />
              <span className="text-red-500 mb-3">Maximum 10 images</span>
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
