"use client";
import {
  API_URL_Vehicle,
  API_URL_Vehicle_For_Image,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import React, { useEffect, useRef, useState } from "react";
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
    height: "",
    width: "",
    length: "",
    passengerCapacity: "",
    LocalAuthority: "",
    cargoCapacity: "",
    vehicleStatus: "",
    horsepower: "",
    torque: "",
    acceleration: "",
    topSpeed: "",
    fuelEfficiency: "",
    safetyFeatures: [],
    techFeatures: [],
    towingCapacity: "",
    price: "",
    registrationNumber: "",
    warrantyInfo: "",
    adminCreatedBy: "",
    adminCompanyName: "",
    isActive: false,
    // new fields
    enginesize: "",
    chasisnumber: "",
    vehicleSite: "",
    fleetEntryDate: "",
    milesOnFleetEntry: "",
    plannedFleetExit: "",
    milesOnFleetExit: "",
    actualExitDate: "",
    milesAtActualExit: "",
    doors: "",
    color: "",
    editablecolor: "",
    roadTaxDate: "",
    roadTaxCycle: "",
    motDueDate: "",
    motCycle: "",
    seats: "",
    abiCode: "",
    nextServiceDate: "",
    nextServiceMiles: "",
    roadTaxCost: "",

    listPrice: "",
    purchasePrice: "",
    insuranceValue: "",
    departmentCode: "",
    maintenance: false,
    issues_damage: "",
    damage_image: [],
    recovery: "",
    organization: "",
    repairStatus: "",
    jobNumber: "",
    memo: "",
    partNumber: "",
    partName: "",
    partprice: "",
    partsupplier: "",
    TestDate: "",
    PlateExpiryDate: "",
    Insurance: "",
    insurancePolicyNumber: "",
    PDFofPolicy: "",
    defect: "",
    Defectdate: "",
    defectstatus: "",
    defectdescription: "",
    defectaction: "",
  });

  const [superadmin, setSuperadmin] = useState(null);
  const [localAuthority, setLocalAuth] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [damagePreview, setdamagePreview] = useState([]);
  const [pdfPreview, setpdfPreview] = useState(null);
  const [transmission, setTransmission] = useState([]);
  const [type, setType] = useState([]);
  const [fueltype, setFuelType] = useState([]);
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [step, setStep] = useState(1);
  const [selectedSite, setSelectedSite] = useState("");
  const [maintenance, setMaintenance] = useState(false);
  const [selfFitSetting, setSelfFitSetting] = useState(false);

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
      // Handle regular checkbox inputs
      if (type === "checkbox" && name === "maintenance") {
        // Set isActive specifically as a boolean
        return {
          ...prevData,
          [name]: checked, // This will now ensure isActive is a boolean
        };
      }

      // Handle file inputs
      if (type === "file" && name === "PDFofPolicy") {
        return {
          ...prevData,
          [name]: files[0],
        };
      }

      // Handle regular inputs (text, radio, etc.)
      return {
        ...prevData,
        [name]: value,
      };
    });
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
  const fetchVehicleData = async () => {
    try {
      const response = await axios.get(`${API_URL_Vehicle}/${vehicleId}`);
      setVehicleData(response.data.result);
      console.log(response.data.result);
      setImagePreview(response.data.result.images || null);
      setdamagePreview(response.data.result.damageImage || null);
      setpdfPreview(response.data.result.PDFofPolicyUrl || null);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };
  useEffect(() => {
    if (vehicleId) {
      fetchVehicleData();
    }
  }, [vehicleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // for (const key in vehicleData) {
    //   if (key === "imageFiles") {
    //     vehicleData.imageFiles.forEach((file) => {
    //       formData.append("imageFiles", file);
    //     });
    //   } else if (typeof vehicleData[key] === "object") {
    //     for (const subKey in vehicleData[key]) {
    //       formData.append(`${key}[${subKey}]`, vehicleData[key][subKey]);
    //     }
    //   } else {
    //     formData.append(key, vehicleData[key]);
    //   }
    // }

    for (const key in vehicleData) {
      if (key === "imageFiles" || key === "damage_image") {
        vehicleData[key].forEach((file) => {
          formData.append(key, file); // Append each file
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
      const response = await axios.put(
        `${API_URL_Vehicle}/${vehicleId}`,
        vehicleData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      fetchData();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error updating vehicle data:", error);
      toast.error(response.data.error);
    }
  };

  const [sele, setselect] = useState("");
  const handleImageClick = (img) => {
    // Open the file input dialog when an image preview is clicked
    setselect(img);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    console.log(file);

    // Extracting necessary properties from the img object
    const { _id, url, publicId } = sele;
    console.log("Image _id:", _id);
    console.log("Image URL:", url);
    console.log("Image Public ID:", publicId);
    // Check if the selected file exists
    if (!file) {
      console.error("No image file found for upload.");
      return;
    }
    const formData = new FormData();
    formData.append("imagepublicId", publicId);
    formData.append("imageFile", file);

    try {
      const response = await axios.put(
        `${API_URL_Vehicle_For_Image}/${_id}`, // Ensure you're using the correct endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchVehicleData();
      console.log("Response:", response.data); // Log the response data
    } catch (error) {
      console.error("Error updating vehicle image:", error);
    }
  };

  if (!isOpen) return null;

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
      // new fields
      enginesize: "",
      chasisnumber: "",
      vehicleSite: "",
      fleetEntryDate: "",
      milesOnFleetEntry: "",
      plannedFleetExit: "",
      milesOnFleetExit: "",
      actualExitDate: "",
      milesAtActualExit: "",
      doors: "",
      color: "",
      editablecolor: "",
      roadTaxDate: "",
      roadTaxCycle: "",
      motDueDate: "",
      motCycle: "",
      seats: "",
      abiCode: "",
      nextServiceDate: "",
      nextServiceMiles: "",
      roadTaxCost: "",
      listPrice: "",
      purchasePrice: "",
      insuranceValue: "",
      departmentCode: "",
      maintenance: false,
      issues_damage: "",
      damage_image: "",
      recovery: "",
      organization: "",
      repairStatus: "",
      jobNumber: "",
      memo: "",
      partNumber: "",
      partName: "",
      partprice: "",
      partsupplier: "",

      TestDate: "",
      PlateExpiryDate: "",
      Insurance: "",
      insurancePolicyNumber: "",
      PDFofPolicy: "",
      defect: "",
      Defectdate: "",
      defectstatus: "",
      defectdescription: "",
      defectaction: "",

      additionalInfo: "",
      RPCExpiryDate: "",
      tailLiftExpirydate: "",
      forkLiftNumber: "",
      ForkLiftInspectionDate: "",

      warrantyInfo: "",
      adminCreatedBy: "",
      adminCompanyName: vehicleData.adminCompanyName,
      isActive: false,
      imageFiles: [], // Reset to an empty array
    });
  };

  // Handle navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const selectSiteClick = (e) => {
    setSelectedSite(e.target.value);
    setVehicleData((prevData) => ({
      ...prevData,
      vehicleSite: e.target.value,
    }));
  };

  const handleMaintenanceToggle = (e) => {
    const { checked } = e.target;
    setMaintenance(!maintenance);
    setVehicleData((prevData) => ({
      ...prevData,
      maintenance: checked,
    }));
  };

  const handleSelfFitsettingToggle = () => {
    // const { checked } = e.target;
    setSelfFitSetting(!selfFitSetting);
    // setVehicleData((prevData) => ({
    //   ...prevData,
    //   maintenance: checked,
    // }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
          {step === 1 && (
            <>
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
                    <label className="block font-semibold">
                      Exterior Color
                    </label>
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
                    <label className="block font-semibold">
                      Interior Color
                    </label>
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
              <button
                onClick={nextStep}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md"
              >
                Next
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setStep(1);
                }}
                className="px-6 py-2 ml-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Close
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {" "}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
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
                    <label className="block font-semibold">
                      Cargo Capacity
                    </label>
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
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
                    <label className="block font-semibold">
                      Top Speed (mph)
                    </label>
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
                    <label className="block font-semibold">
                      Safety Features
                    </label>
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
                    <label className="block font-semibold">
                      Fuel Efficiency
                    </label>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
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

                {/* <div>
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
                    {localAuthority.map((auth) => (
                      <option key={auth.id} value={auth.name}>
                        {auth.name}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* Vehicle Status Section */}
                {/* <div className="">
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
            </div> */}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="px-6 py-2 ml-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                <div>
                  <div className="flex gap-1">
                    <label className="block font-semibold">Engine Size</label>
                  </div>
                  <input
                    type="number"
                    name="enginesize"
                    value={vehicleData.enginesize}
                    onChange={handleChange}
                    placeholder="Enter Engine Size"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label className="block font-semibold">
                      Vin / Chasis Number
                    </label>
                  </div>
                  <input
                    type="text"
                    name="chasisnumber"
                    value={vehicleData.chasisnumber}
                    onChange={handleChange}
                    placeholder="Enter Engine Size"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="">
                  <div className="flex gap-1">
                    <label className="block font-semibold">Vehicle Site</label>
                    <span className="text-red-600">*</span>
                  </div>
                  <select
                    name="vehicleSite"
                    value={vehicleData.vehicleSite}
                    onChange={handleChange}
                    onClick={selectSiteClick}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select vehicle site</option>
                    <option value="Headquarters">Headquarters</option>
                    <option value="WarehouseA">Warehouse A</option>
                    <option value="WarehouseB">Warehouse B</option>
                    <option value="ServiceCenter">Service Center</option>
                    <option value="RemoteSite">Remote Site</option>
                  </select>
                </div>
                {/* Conditionally Rendered Fleet Details */}
              </div>
              {selectedSite && (
                <>
                  <h3 className="font-semibold mt-4">Fleet Entry Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                    <div>
                      <label className="block">Date Fleet Entry</label>
                      <input
                        type="date"
                        name="fleetEntryDate"
                        value={vehicleData.fleetEntryDate}
                        onChange={handleChange}
                        placeholder="Enter fleet entry date"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block">Miles on Fleet Entry</label>
                      <input
                        type="text"
                        name="milesOnFleetEntry"
                        value={vehicleData.milesOnFleetEntry}
                        onChange={handleChange}
                        placeholder="Enter miles on fleet entry"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block">Planned Fleet Exit</label>
                      <input
                        type="text"
                        name="plannedFleetExit"
                        value={vehicleData.plannedFleetExit}
                        onChange={handleChange}
                        placeholder="Enter planned fleet exit"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block">Miles on Fleet Exit</label>
                      <input
                        type="text"
                        name="milesOnFleetExit"
                        value={vehicleData.milesOnFleetExit}
                        onChange={handleChange}
                        placeholder="Enter miles on fleet exit"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block">
                        Actual Date Exited From Fleet
                      </label>
                      <input
                        type="date"
                        name="actualExitDate"
                        value={vehicleData.actualExitDate}
                        onChange={handleChange}
                        placeholder="Enter actual exit date"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block">Miles at Actual Exit</label>
                      <input
                        type="text"
                        name="milesAtActualExit"
                        value={vehicleData.milesAtActualExit}
                        onChange={handleChange}
                        placeholder="Enter miles at actual exit"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
                <div>
                  <div className="flex gap-1">
                    <label className="block font-semibold">Doors</label>
                  </div>
                  <input
                    type="number"
                    name="doors"
                    value={vehicleData.doors}
                    onChange={handleChange}
                    placeholder="Enter Engine Size"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label className="block font-semibold">Colour</label>
                    <span className="text-red-600">*</span>
                  </div>

                  <select
                    name="color"
                    value={vehicleData.color}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select color</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                  </select>
                </div>

                <div>
                  <div className="flex gap-1">
                    <label className=" font-semibold">Editable Color</label>
                  </div>
                  <input
                    type="text"
                    name="editablecolor"
                    value={vehicleData.editablecolor}
                    onChange={handleChange}
                    placeholder="Enter custom color"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-3 gap-2 mt-4">
                <div>
                  <label className="block font-semibold">Road Tax Date</label>
                  <input
                    type="date"
                    name="roadTaxDate"
                    value={vehicleData.roadTaxDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Road Tax Cycle */}
                <div>
                  <label className="block font-semibold">Road Tax Cycle</label>
                  <select
                    name="roadTaxCycle"
                    value={vehicleData.roadTaxCycle}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Cycle</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                </div>

                {/* MOT Due Date */}
                <div>
                  <label className="block font-semibold">MOT Due Date</label>
                  <input
                    type="date"
                    name="motDueDate"
                    value={vehicleData.motDueDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                {/* MOT Cycle */}
                <div>
                  <label className="block font-semibold">MOT Cycle</label>
                  <select
                    name="motCycle"
                    value={vehicleData.motCycle}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Cycle</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                </div>

                {/* Seats */}
                <div>
                  <label className="block font-semibold">Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={vehicleData.seats}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter number of seats"
                  />
                </div>

                {/* ABI Code */}
                <div>
                  <label className="block font-semibold">ABI Code</label>
                  <input
                    type="text"
                    name="abiCode"
                    value={vehicleData.abiCode}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter ABI Code"
                  />
                </div>

                {/* Next Service Date */}
                <div>
                  <label className="block font-semibold">
                    Next Service Date
                  </label>
                  <input
                    type="date"
                    name="nextServiceDate"
                    value={vehicleData.nextServiceDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Next Service Miles */}
                <div>
                  <label className="block font-semibold">
                    Next Service Miles
                  </label>
                  <input
                    type="number"
                    name="nextServiceMiles"
                    value={vehicleData.nextServiceMiles}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter miles for next service"
                  />
                </div>

                {/* Road Tax Cost */}
                <div>
                  <label className="block font-semibold">Road Tax Cost</label>
                  <input
                    type="number"
                    name="roadTaxCost"
                    value={vehicleData.roadTaxCost}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter road tax cost"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="px-6 py-2 ml-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-bold mb-4">
                Financials Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    List Price (P11D)
                  </label>
                  <input
                    type="number"
                    name="listPrice"
                    value={vehicleData.listPrice}
                    onChange={handleChange}
                    placeholder="Enter List Price"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={vehicleData.purchasePrice}
                    onChange={handleChange}
                    placeholder="Enter Purchase Price"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Insurance Value
                  </label>
                  <input
                    type="number"
                    name="insuranceValue"
                    value={vehicleData.insuranceValue}
                    onChange={handleChange}
                    placeholder="Enter Insurance Value"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-1">
                    Department Code
                  </label>
                  <input
                    type="text"
                    name="departmentCode"
                    value={vehicleData.departmentCode}
                    onChange={handleChange}
                    placeholder="Enter Department Code"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1">
                  <input
                    type="checkbox"
                    name="maintenance"
                    // checked={maintenance}
                    checked={vehicleData.maintenance}
                    // onChange={handleMaintenanceToggle}
                    onChange={handleChange}
                    onClick={handleMaintenanceToggle}
                    // onClick={selectSiteClick}
                    className="mr-2"
                  />
                  Maintenance Record (if any notable maintenance done till date)
                </label>
              </div>
              {maintenance === true && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
                    <div className="mb-4">
                      <label className="text-gray-700 font-semibold mb-1">
                        Issues/Damage
                      </label>
                      <textarea
                        name="issues_damage"
                        value={vehicleData.issues_damage}
                        onChange={handleChange}
                        placeholder="Describe any issues or damage"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-1">
                        Damage Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                        <input
                          type="file"
                          id="damage_image"
                          name="damage_image"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:background-gray-100 hover:file:bg-gray-200 file:text-sm"
                          multiple
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-1">
                        Recovery
                      </label>
                      <input
                        type="text"
                        name="recovery"
                        value={vehicleData.recovery}
                        onChange={handleChange}
                        placeholder="Describe recovery actions"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-1">
                        Organization
                      </label>
                      <select
                        name="organization"
                        value={vehicleData.organization}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select Organization</option>
                        <option value="Organization1">Organization 1</option>
                        <option value="Organization2">Organization 2</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-1">
                        Repair Status
                      </label>
                      <input
                        type="text"
                        name="repairStatus"
                        value={vehicleData.repairStatus}
                        onChange={handleChange}
                        placeholder="Enter repair status"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-1">
                        Job Number
                      </label>
                      <input
                        type="text"
                        name="jobNumber"
                        value={vehicleData.jobNumber}
                        onChange={handleChange}
                        placeholder="Enter job number"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-1">
                        Memo
                      </label>
                      <textarea
                        name="memo"
                        value={vehicleData.memo}
                        onChange={handleChange}
                        placeholder="Memo for the repair"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Parts (Add multiple parts for a repair)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
                    <div>
                      <input
                        type="text"
                        name="partNumber"
                        value={vehicleData.partNumber}
                        onChange={handleChange}
                        placeholder="Part Number"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="partName"
                        value={vehicleData.partName}
                        onChange={handleChange}
                        placeholder="Part Name"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                      />
                    </div>

                    <div>
                      <input
                        type="number"
                        name="partprice"
                        value={vehicleData.partprice}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                      />
                    </div>

                    <div>
                      <select
                        name="partsupplier"
                        value={vehicleData.partsupplier}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                      >
                        <option value="">Select Supplier</option>
                        <option value="Supplier1">Supplier 1</option>
                        <option value="Supplier2">Supplier 2</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <h2 className="text-2xl font-bold mb-4">Commercial Vehicles</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
                <div>
                  <label className="block font-semibold">RPC Expiry Date</label>
                  <input
                    type="date"
                    name="RPCExpiryDate"
                    value={vehicleData.RPCExpiryDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    Tail-Lift Expiry Date
                  </label>
                  <input
                    type="date"
                    name="TailLiftExpiryDate"
                    value={vehicleData.tailLiftExpirydate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    Fork Lift Inspection Date
                  </label>
                  <input
                    type="date"
                    name="ForkLiftInspectionDate"
                    value={vehicleData.ForkLiftInspectionDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    Fork Lift Inspection Number/Notes
                  </label>
                  <input
                    type="text"
                    name="ForkLiftInspectionNumberNotes"
                    value={vehicleData.forkLiftNumber}
                    onChange={handleChange}
                    placeholder="Enter inspection number or notes"
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              </div>
              {/* Toggle for self-fit setting */}
              <div className="flex items-center space-x-2">
                <label className="block text-gray-700 font-semibold mb-1">
                  <input
                    type="checkbox"
                    name="selfFitSetting"
                    onChange={handleSelfFitsettingToggle}
                    checked={selfFitSetting}
                    className="mr-2"
                  />
                  Self-Fit Setting
                </label>
              </div>

              {selfFitSetting && (
                <div>
                  <label className="block font-semibold">
                    Additional Info:
                  </label>
                  <textarea
                    value={vehicleData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Enter any additional info"
                    className="w-full border border-gray-300 p-2 rounded-md"
                    rows="3"
                  />
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                  className="px-6 py-2 ml-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <h2 className="text-2xl font-bold mb-4">Local Authority</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
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
                    {localAuthority.map((auth) => (
                      <option key={auth.id} value={auth.name}>
                        {auth.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold">Test Date</label>
                  <input
                    type="date"
                    name="TestDate"
                    value={vehicleData.TestDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    Plate Expiry Date
                  </label>
                  <input
                    type="date"
                    name="PlateExpiryDate"
                    value={vehicleData.PlateExpiryDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">Insurance</label>
                  <input
                    type="text"
                    name="Insurance"
                    value={vehicleData.Insurance}
                    onChange={handleChange}
                    placeholder="Enter insurance details"
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    Insurance Policy Number:
                  </label>
                  <input
                    type="text"
                    name="insurancePolicyNumber"
                    value={vehicleData.insurancePolicyNumber}
                    onChange={handleChange}
                    placeholder="Enter policy number"
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">
                    Add PDF/Picture of Policy:
                  </label>
                  <input
                    type="file"
                    name="PDFofPolicy"
                    onChange={handleChange}
                    accept="application/pdf, image/*"
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Defect Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
                <div>
                  <label className="block font-semibold">Defect</label>
                  <input
                    type="text"
                    name="defect"
                    value={vehicleData.defect}
                    onChange={handleChange}
                    placeholder="Enter defect name"
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">Date</label>
                  <input
                    type="date"
                    name="Defectdate"
                    value={vehicleData.Defectdate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold">Status</label>
                  <select
                    name="defectstatus"
                    value={vehicleData.defectstatus}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md"
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    {/* Add more statuses as needed */}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold">Description</label>
                  <textarea
                    name="defectdescription"
                    value={vehicleData.defectdescription}
                    onChange={handleChange}
                    placeholder="Enter a brief description of the defect"
                    className="w-full border border-gray-300 p-2 rounded-md resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block font-semibold">Action</label>
                  <textarea
                    name="defectaction"
                    value={vehicleData.defectaction}
                    onChange={handleChange}
                    placeholder="Describe the action taken or needed"
                    className="w-full border border-gray-300 p-2 rounded-md resize-none"
                    rows="3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 mb-2">
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
                    className="border-2 border-dashed border-gray-300 rounded-lg p-5 resize-none" // Added 'resize-none' for better layout control
                    placeholder="e.g., 3 years or 36,000 miles"
                    required
                  />
                </div>
                <div className="">
                  <label className="block font-semibold">Vehicle Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
                    <input
                      type="file"
                      id="imageFiles"
                      name="imageFiles"
                      onChange={handleChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:background-gray-100 hover:file:bg-gray-200 file:text-sm"
                      placeholder="Select up to 10 images"
                      multiple
                    />
                    <span className="block text-red-500 mt-2 text-sm">
                      Maximum 10 images
                    </span>
                  </div>
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

              <div className="mt-3">
                {/* File input for selecting an image */}
                <div>Vehicle Images</div>
                <div>
                  {/* Hidden file input for selecting an image */}
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*"
                    ref={fileInputRef} // Assign ref to the file input
                    style={{ display: "none" }} // Hide the input element
                  />

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2  mb-2">
                    {imagePreview.map((img, index) => (
                      <div
                        key={index}
                        className="cursor-pointer"
                        onClick={() => handleImageClick(img)} // Call handleImageClick with img
                      >
                        <img
                          src={img.url}
                          alt="Avatar Preview"
                          className="avatar-preview w-32 h-20"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                {/* File input for selecting an image */}
                <div>Demage Images</div>
                <div>
                  {/* Hidden file input for selecting an image */}
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*"
                    ref={fileInputRef} // Assign ref to the file input
                    style={{ display: "none" }} // Hide the input element
                  />

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2  mb-2">
                    {damagePreview.map((dimg, index) => (
                      <div
                        key={index}
                        className="cursor-pointer"
                        onClick={() => handleImageClick(dimg)} // Call handleImageClick with img
                      >
                        <img
                          src={dimg.url}
                          alt="Avatar Preview"
                          className="avatar-preview w-32 h-20"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                {/* File input for selecting an image */}
                <div>Pdf File</div>
                <div>
                  {/* Hidden file input for selecting an image
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*"
                    ref={fileInputRef} // Assign ref to the file input
                    style={{ display: "none" }} // Hide the input element
                  /> */}

                  {/* {pdfPreview.map((dimg, index) => ( */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => window.open(pdfPreview, "_blank")} // Opens the PDF in a new tab
                    >
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhkCWG2q6izXrv9oKcp53cb6dUBBoX246G0w&s"
                        alt="Avatar Preview"
                        className="avatar-preview w-40 h-20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Back
                </button>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="px-6 py-2 ml-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateVehicleModel;
