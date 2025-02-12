"use client";
import { API_URL_Vehicle, API_URL_VehicleMOT, API_URL_VehicleRoadTex, API_URL_VehicleService } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
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
  const [step, setStep] = useState(1);
  // const [selectedSite, setSelectedSite] = useState("");
  const [maintenance, setMaintenance] = useState(false);
  const [selfFitSetting, setSelfFitSetting] = useState(false);
  const [fileInputs, setFileInputs] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
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
    additionalInfo: "",
    RPCExpiryDate: "",
    tailLiftExpirydate: "",
    forkLiftNumber: "",
    ForkLiftInspectionDate: "",
    cardocuments: [],
    isActive: false,
    imageFiles: [], // Store selected image files
  });

  const pageonerequiredfeilds = [
    "manufacturer",
    "model",
    "year",
    "type",
    "engineType",
    "fuelType",
    "transmission",
    "drivetrain",
    "exteriorColor",
    "interiorColor",
  ];
  const pagetworequiredfeilds = [
    "safetyFeatures",
    "techFeatures",
    "price",
    "registrationNumber",
  ];
  const pagefiverequiredfeilds = [
    "LocalAuthority",
    "warrantyInfo",
  ];

  const areFieldsFilled = (fields) =>
    fields.every((field) => vehicleData[field] !== "");
  const isNextDisabled1st = !areFieldsFilled(pageonerequiredfeilds);
  const isNextDisabled2nd = !areFieldsFilled(pagetworequiredfeilds);
  const isNextDisabled5th = !areFieldsFilled(pagefiverequiredfeilds);


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
        const storedCompanyName = localStorage.getItem("companyName");
        const localAuthData = await fetchLocalAuth();
        const manufacturerData = await fetchManfacturer();
        const transmissionData = await fetchTransmission();
        const typeData = await fetchType();
        const fueltypeData = await fetchFuelType();
        const currentCompanyName = storedCompanyName;

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
        // console.log(filteredManufacturer);
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setVehicleData((prevData) => {
      // Handle multi-select dropdown
      // if (type === "select-multiple") {
      //   const selectedValues = Array.from(options)
      //     .filter((option) => option.selected)
      //     .map((option) => option.value);

      //   return {
      //     ...prevData,
      //     [name]: selectedValues,
      //   };
      // }

      // Handle file inputs
      if (type === "file") {
        return {
          ...prevData,
          [name]: Array.from(files), // Convert FileList to an array
        };
      }
      // Handle file inputs
      if (type === "file" && name === "damage_image") {
        return {
          ...prevData,
          [name]: files[0],
        };
      }
      // Handle file inputs
      if (type === "file" && name === "PDFofPolicy") {
        return {
          ...prevData,
          [name]: files[0],
        };
      }

      // Handle checkbox inputs for safety features
      // if (name === "safetyFeatures") {
      //   const currentSafetyFeatures = prevData[name] || [];
      //   if (checked) {
      //     // Add feature if checked
      //     return {
      //       ...prevData,
      //       [name]: [...currentSafetyFeatures, value], // Add selected feature
      //     };
      //   } else {
      //     // Remove feature if unchecked
      //     return {
      //       ...prevData,
      //       [name]: currentSafetyFeatures.filter(
      //         (feature) => feature !== value
      //       ), // Remove deselected feature
      //     };
      //   }
      // }

      // Handle checkbox inputs for technology features
      // if (name === "techFeatures") {
      //   const currentTechFeatures = prevData.techFeatures || [];
      //   if (checked) {
      //     // Add feature if checked
      //     return {
      //       ...prevData,
      //       [name]: [...currentTechFeatures, value], // Add selected feature
      //     };
      //   } else {
      //     // Remove feature if unchecked
      //     return {
      //       ...prevData,
      //       [name]: currentTechFeatures.filter((feature) => feature !== value), // Remove deselected feature
      //     };
      //   }
      // }

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
  const defaultOptions = [
    { value: "airbags", label: "Airbags" },
    { value: "abs", label: "ABS" },
  ];
  const defaulttech = [
    { value: "navigation", label: "Navigation" },
    { value: "bluetooth", label: "Bluetooth" },
  ];

  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);
  const [selectedOptionstech, setSelectedtech] = useState(defaulttech);

  const options = [
    { value: "airbags", label: "Airbags" },
    { value: "abs", label: "ABS" },
    { value: "stability control", label: "Stability Control" },
    { value: "traction control", label: "Traction Control" },
    { value: "blind spot monitoring", label: "Blind Spot Monitoring" },
    { value: "lane departure warning", label: "Lane Departure Warning" },
    { value: "adaptive cruise control", label: "Adaptive Cruise Control" },
    { value: "rearview camera", label: "Rearview Camera" },
    { value: "parking sensors", label: "Parking Sensors" },
    {
      value: "automatic emergency braking",
      label: "Automatic Emergency Braking",
    },
  ];

  const featurestech = [
    { value: "navigation", label: "Navigation" },
    { value: "bluetooth", label: "Bluetooth" },
    { value: "backup_camera", label: "Backup Camera" },
    { value: "adaptive_headlights", label: "Adaptive Headlights" },
    { value: "lane_keep_assist", label: "Lane Keep Assist" },
    { value: "parking_assist", label: "Parking Assist" },
    { value: "smartphone_integration", label: "Smartphone Integration" },
    { value: "voice_recognition", label: "Voice Recognition" },
    { value: "keyless_entry", label: "Keyless Entry" },
    { value: "rear_seat_entertainment", label: "Rear Seat Entertainment" },
  ];

  const handleChangesafty = (selected) => {
    setSelectedOptions(selected);
    const selectedValues = selected.map((option) => option.value);
    console.log("Selected Values:", selectedValues);
    setVehicleData((prevData) => ({
      ...prevData,
      safetyFeatures: selectedValues, // Update the state for the specific field
    }));
    // saveToDatabase(selectedValues); // Save new selections to the database
  };
  const handleChangestech = (selected) => {
    setSelectedtech(selected);
    const selectedValues = selected.map((option) => option.value);
    console.log("Selected Values:", selectedValues);
    setVehicleData((prevData) => ({
      ...prevData,
      techFeatures: selectedValues, // Update the state for the specific field
    }));
    // saveToDatabase(selectedValues); // Save new selections to the database
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in vehicleData) {
      if (
        key === "imageFiles" ||
        key === "damage_image" ||
        key === "cardocuments"
      ) {
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

    // console.log(vehicleData);


    try {
      const response = await axios.post(API_URL_Vehicle, vehicleData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(response.data.vehicle);


      if (response.data.success) {
        toast.success(response.data.message);
        try {
          const vehicleData = response.data.vehicle;

          if (vehicleData.motDueDate) {
            await sendMotData({
              VehicleName: vehicleData.model,
              registrationNumber: vehicleData.registrationNumber,
              VehicleId: vehicleData._id,
              motCurrentDate: "",
              motDueDate: vehicleData.motDueDate,
              motCycle: vehicleData.motCycle,
              motStatus: "done",
              VehicleStatus: vehicleData.isActive,
              asignto: "N/A",
              motPending_Done: "0",
              adminCreatedBy: "",
              adminCompanyName: vehicleData.adminCompanyName,
              adminCompanyId: "",
            });
          }

          if (vehicleData.nextServiceDate && vehicleData.nextServiceMiles) {
            await sendServiceData({
              VehicleName: vehicleData.model,
              registrationNumber: vehicleData.registrationNumber,
              VehicleId: vehicleData._id,
              serviceCurrentDate: "",
              serviceDueDate: vehicleData.nextServiceDate,
              serviceStatus: "done",
              VehicleStatus: vehicleData.isActive,
              servicemailes: vehicleData.nextServiceMiles,
              asignto: "N/A",
              servicePending_Done: "0",
              adminCreatedBy: "",
              adminCompanyName: vehicleData.adminCompanyName,
              adminCompanyId: "",
            });
          }

          if (
            vehicleData.roadTaxDate &&
            vehicleData.roadTaxCycle &&
            vehicleData.roadTaxCost
          ) {
            await sendRoadTaxData({
              VehicleName: vehicleData.model,
              registrationNumber: vehicleData.registrationNumber,
              VehicleId: vehicleData._id,
              roadtexCurrentDate: "",
              roadtexDueDate: vehicleData.roadTaxDate,
              roadtexCycle: vehicleData.roadTaxCycle,
              VehicleStatus: vehicleData.roadTaxCost,
              roadtexStatus: "done",
              VehicleStatus: vehicleData.isActive,
              asignto: "N/A",
              roadtexPending_Done: "0",
              adminCreatedBy: "",
              adminCompanyName: vehicleData.adminCompanyName,
              adminCompanyId: "",
            });
          }
        } catch (error) {
          console.error("Error sending data:", error);
          toast.error("Failed to send data");
        }

        fetchData();
        onClose();
        resetForm();
        setFileInputs([]);
        setFiles([]);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error submitting vehicle data:", error);
    }
  };


  // Function to send MOT Data
  const sendMotData = async (motData) => {
    try {
      const res = await axios.post(API_URL_VehicleMOT, motData);
      console.log("MOT Data sent successfully:", res.data);
    } catch (error) {
      console.error("Failed to send MOT data:", error);
    }
  };

  // Function to send Service Data
  const sendServiceData = async (serviceData) => {
    try {
      const res = await axios.post(API_URL_VehicleService, serviceData);
      console.log("Service Data sent successfully:", res.data);
    } catch (error) {
      console.error("Failed to send Service data:", error);
    }
  };

  // Function to send Road Tax Data
  const sendRoadTaxData = async (roadTaxData) => {
    try {
      const res = await axios.post(API_URL_VehicleRoadTex, roadTaxData);
      console.log("Road Tax Data sent successfully:", res.data);
    } catch (error) {
      console.error("Failed to send Road Tax data:", error);
    }
  };

  const resetForm = () => {
    setStep(1);
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
      adminCompanyName: "",
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

      additionalInfo: "",
      RPCExpiryDate: "",
      tailLiftExpirydate: "",
      forkLiftNumber: "",
      ForkLiftInspectionDate: "",
      cardocuments: [],

      adminCompanyName: vehicleData.adminCompanyName,
      isActive: false,
      imageFiles: [], // Reset to an empty array
    });
  };

  // const handlepassengerChange = (e) => {
  //   setVehicleData((prevData) => ({
  //     ...prevData,
  //     passengerCapacity: e.target.value,
  //   }));
  // };

  const handleMaintenanceToggle = (e) => {
    const { checked } = e.target;
    setMaintenance(!maintenance);
    setVehicleData((prevData) => ({
      ...prevData,
      maintenance: checked,
    }));
  };

  const handleSelfFitsettingToggle = () => {
    setSelfFitSetting(!selfFitSetting);
  };

  // Add a new file input by incrementing the input count
  const addFileInput = () => {
    if (fileInputs.length < 5) {
      setFileInputs([...fileInputs, `input-${Date.now()}`]);
    } else {
      alert("You Not Added More Then 5 Files");
    }
  };

  // Handle file selection for each input and store it in `files`
  const handleFileChange = (event, index) => {
    const selectedFile = event.target.files[0];
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index] = selectedFile; // Update file in the array at the specific index
      return updatedFiles;
    });

    setVehicleData((prevData) => ({
      ...prevData,
      cardocuments: [...prevData.cardocuments, selectedFile],
    }));

    // Update previews array
    setPreviews((prevPreviews) => {
      const updatedPreviews = [...prevPreviews];
      updatedPreviews[index] = selectedFile
        ? URL.createObjectURL(selectedFile)
        : null; // Create a preview URL
      return updatedPreviews;
    });
  };

  // Trigger file input click programmatically when image is clicked
  const handleImageClick = (index) => {
    document.getElementsByName("cardocuments")[index].click();
  };
  const cancleimages = () => {
    setFileInputs([]);
    setFiles([]);
  };
  const removeFileInput = (idx) => {
    // console.log(idx);

    setFileInputs((prevInputs) =>
      prevInputs.filter((_, index) => index !== idx)
    );

    // Remove the corresponding file from files
    setFiles((prevFiles) => {
      // Create a new array that excludes the file at the specified index
      return prevFiles.filter((_, index) => index !== idx);
    });

    // Remove the corresponding preview from previews
    setPreviews((prevPreviews) => {
      return prevPreviews.filter((_, index) => index !== idx);
    });

    // console.log(updatedPreviews);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Vehicle Form
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
            setStep(1);
          }} />
        </div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 ">
          {step === 1 && (
            <>
              {/* <h2 className="text-2xl font-bold mb-6">Vehicle Form</h2> */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4">
                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">Manufacturer</label>
                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="manufacturer"
                      className="text-[10px]"
                    >
                      Manufacturer <span className="text-red-600">*</span>
                    </label>
                  </div>

                  <select
                    id="manufacturer"
                    name="manufacturer"
                    value={vehicleData.manufacturer}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
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
                    {/* <label className="block font-semibold">Model</label>
                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="model"
                      className="text-[10px]"
                    >
                      Model <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="model"
                    value={vehicleData.model}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="e.g., Camry, Mustang"
                    required
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">Year</label>
                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="year"
                      className="text-[10px]"
                    >
                      Year <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    name="year"
                    value={vehicleData.year}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="e.g., 2024"
                    required
                  />
                </div>

                <div className="">
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">Body Type</label>
                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="body_Type"
                      className="text-[10px]"
                    >
                      Body Type <span className="text-red-600">*</span>
                    </label>
                  </div>

                  <select
                    name="type"
                    value={vehicleData.type}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
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
                    {/* <label className="block font-semibold">Engine Type</label>
                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="body_Type"
                      className="text-[10px]"
                    >
                      Engine Type <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="engineType"
                    value={vehicleData.engineType}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="e.g., 2.5L 4-Cylinder"
                    required
                  />
                </div>

                <div className="">
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">Fuel Type</label>
                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Fuel Type <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <select
                    name="fuelType"
                    value={vehicleData.fuelType}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
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


                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">Transmission</label>
                    <span className="text-red-600">*</span> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Transmission <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <select
                    name="transmission"
                    value={vehicleData.transmission}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
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
                    {/* <label className="block font-semibold">Drivetrain</label>
                    <span className="text-red-600">*</span> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Drivetrain <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <select
                    name="drivetrain"
                    value={vehicleData.drivetrain}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
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
                    {/* <label className="block font-semibold">
                      Exterior Color
                    </label>
                    <span className="text-red-600">*</span> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Exterior Color <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="exteriorColor"
                    value={vehicleData.exteriorColor}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="e.g., Red, Blue"
                    required
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">
                      Interior Color
                    </label>
                    <span className="text-red-600">*</span> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Interior Color <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="interiorColor"
                    value={vehicleData.interiorColor}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="e.g., Black, Beige"
                    required
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label className="text-[10px]">Height</label>
                  </div>
                  <input
                    type="number"
                    name="height"
                    value={vehicleData.height}
                    onChange={handleChange}
                    placeholder="0.001"
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label className="text-[10px]">Width</label>
                  </div>
                  <input
                    type="number"
                    name="width"
                    value={vehicleData.width}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="0.001"
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label className="text-[10px]">Length</label>
                  </div>
                  <input
                    type="number"
                    name="length"
                    value={vehicleData.length}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="0.001"
                  />
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4"> */}

              {/* <div>
                  <div className="flex gap-1">
                    <label className=" font-semibold">Editable Color</label>
                  </div>
                  <input
                    type="text"
                    name="editablecolor"
                    value={vehicleData.editablecolor}
                    onChange={handleChange}
                    placeholder="Enter custom color"
                    className="w-full p-2 border border-[#42506666] rounded-[4px]"
                  />
                </div> */}
              {/* </div> */}


              {/* end of multiple images */}
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    resetForm();
                    cancleimages();
                  }}
                  className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                >
                  Cancel
                </button>
                <button
                  onClick={nextStep}
                  className={`bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8 ${isNextDisabled1st
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-custom-bg text-white hover:bg-gray-600"
                    }`} disabled={isNextDisabled1st}           >
                  Next
                </button>
              </div>
            </>
          )}
          {/* first end */}
          {step === 2 && (
            <>
              {" "}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">
                      Passenger Capacity
                    </label>
                    <span className="text-red-600">*</span> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Passenger Capacity <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <select
                    name="passengerCapacity"
                    value={vehicleData.passengerCapacity}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    required
                  >
                    <option value="" disabled>
                      Select Capacity
                    </option>

                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((val, i) => (
                      <option key={i} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>



                </div>

                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">
                      Cargo Capacity
                    </label> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Cargo Capacity <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="cargoCapacity"
                    value={vehicleData.cargoCapacity}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="Cargo Capacity"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">Horsepower</label> */}

                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Horsepower
                    </label>
                  </div>
                  <input
                    type="number"
                    name="horsepower"
                    value={vehicleData.horsepower}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow" placeholder="Horsepower"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label className="text-[10px]">
                      Fuel Efficiency
                    </label>
                  </div>

                  <input
                    type="text"
                    name="fuelEfficiency"
                    value={vehicleData.fuelEfficiency}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="e.g., 25 MPG"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">Price (£)</label>

                    <span className="text-red-600">*</span> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Price (£) <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={vehicleData.price}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Price"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    {/* <label className="block font-semibold">
                      Registration Number
                    </label> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Registration Number <span className="text-red-600">*</span>
                    </label>

                    {/* <span className="text-red-600">*</span> */}
                  </div>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={vehicleData.registrationNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Registration Number"
                  />
                </div>

                <div>
                  <div>
                    <label htmlFor="taxiFirm" className="text-[10px]">
                      Taxi Local Authority <span className="text-red-600">*</span>
                    </label>

                  </div>
                  <select
                    id="LocalAuthority"
                    name="LocalAuthority"
                    value={vehicleData.LocalAuthority}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
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

                <div>
                  <div>
                    {/* <label className="block font-semibold">
                      Safety Features
                    </label>
                    <span className="text-red-600">*</span> */}

                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Safety Features <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <div className="">
                    {/* List of safety features as checkboxes */}
                    {/* {[
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
                    ))} */}
                    <Select
                      isMulti
                      options={options}
                      value={selectedOptions}
                      onChange={handleChangesafty}
                      placeholder="Select features..."
                      className="react-select w-full border border-[#42506666] rounded shadow"
                      classNamePrefix="select"
                    />
                  </div>
                </div>


                <div className="">
                  <div>
                    {/* <label className="block font-semibold">
                      Technology Features
                    </label> */}
                    <label
                      // htmlFor="Fuel_Type"
                      className="text-[10px]"
                    >
                      Technology Features <span className="text-red-600">*</span>
                    </label>
                    {/* <span className="text-red-600">*</span> */}
                  </div>
                  <div className="">
                    {/* List of technology features as checkboxes */}
                    {/* {[
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
                    ))} */}

                    <Select
                      isMulti
                      options={featurestech}
                      value={selectedOptionstech}
                      onChange={handleChangestech}
                      placeholder="Select Tech..."
                      className="react-select w-full border border-[#42506666] rounded  shadow"
                      classNamePrefix="select"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex gap-1">
                    <label className="text-[10px]">Engine Size</label>
                  </div>
                  <input
                    type="number"
                    name="enginesize"
                    value={vehicleData.enginesize}
                    onChange={handleChange}
                    placeholder="Enter Engine Size"
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label className="text-[10px]">
                      Vin / Chasis Number
                    </label>
                  </div>
                  <input
                    type="text"
                    name="chasisnumber"
                    value={vehicleData.chasisnumber}
                    onChange={handleChange}
                    placeholder="Enter Engine Size"
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                <div className="">
                  <div className="flex gap-1">
                    <label className="text-[10px]">Vehicle Site <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <select
                    // name="vehicleSite"
                    // value={selectedSite}
                    // onChange={handleSiteChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
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

              </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4"> */}


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
                className="w-full p-2 border border-[#42506666] rounded-[4px]"
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
              {/* </div> */}
              <div className="mt-6 flex gap-[10px] justify-between">
                <button
                  onClick={prevStep}
                  className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                >
                  Back
                </button>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetForm();
                      cancleimages();
                    }}
                    className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className={`bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8 ${isNextDisabled2nd
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-custom-bg text-white hover:bg-gray-600"
                      }`} disabled={isNextDisabled2nd}               >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">

                {/* <div className="">
                  <div className="flex gap-1">
                    <label className="block font-semibold">Vehicle Site</label>
                    <span className="text-red-600">*</span>
                  </div>
                  <select
                    name="vehicleSite"
                    value={selectedSite}
                    onChange={handleSiteChange}
                    className="w-full p-2 border border-[#42506666] rounded-[4px]"
                    required
                  >
                    <option value="">Select vehicle site</option>
                    <option value="Headquarters">Headquarters</option>
                    <option value="WarehouseA">Warehouse A</option>
                    <option value="WarehouseB">Warehouse B</option>
                    <option value="ServiceCenter">Service Center</option>
                    <option value="RemoteSite">Remote Site</option>
                  </select>
                </div> */}
                {/* Conditionally Rendered Fleet Details */}
                <div>
                  <div>
                    <label className="text-[10px]">Doors</label>
                  </div>
                  <input
                    type="number"
                    name="doors"
                    value={vehicleData.doors}
                    onChange={handleChange}
                    placeholder="2"
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                <div>
                  <div className="">
                    <label className="text-[10px]">Color <span className="text-red-600">*</span>

                    </label>
                  </div>

                  <select
                    // name="color"
                    // value={vehicleData.color}
                    // onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
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
                  <div>
                    <label className="text-[10px]">Custom Color</label>
                  </div>
                  <input
                    // type="text"
                    // name="editablecolor"
                    // value={vehicleData.editablecolor}
                    onChange={handleChange}
                    placeholder="Custom Color"
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>



                <div>
                  <label className="text-[10px]">Road Tax Date</label>
                  <input
                    type="date"
                    name="roadTaxDate"
                    value={vehicleData.roadTaxDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                {/* Road Tax Cycle */}
                <div>
                  <label className="text-[10px]">Road Tax Cycle</label>
                  <select
                    name="roadTaxCycle"
                    value={vehicleData.roadTaxCycle}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  >
                    <option value="">Select Cycle</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                </div>

                {/* MOT Due Date */}
                <div>
                  <label className="text-[10px]">MOT Due Date</label>
                  <input
                    type="date"
                    name="motDueDate"
                    value={vehicleData.motDueDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                {/* MOT Cycle */}
                <div>
                  <label className="text-[10px]">MOT Cycle</label>
                  <select
                    name="motCycle"
                    value={vehicleData.motCycle}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  >
                    <option value="">Select Cycle</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                </div>

                {/* ABI Code */}
                <div>
                  <label className="text-[10px]">ABI Code</label>
                  <input
                    type="text"
                    name="abiCode"
                    value={vehicleData.abiCode}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="Enter ABI Code"
                  />
                </div>

                {/* Next Service Date */}
                <div>
                  <label className="text-[10px]">
                    Next Service Date
                  </label>
                  <input
                    type="date"
                    name="nextServiceDate"
                    value={vehicleData.nextServiceDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                {/* Next Service Miles */}
                <div>
                  <label className="text-[10px]">
                    Next Service Miles
                  </label>
                  <input
                    type="number"
                    name="nextServiceMiles"
                    value={vehicleData.nextServiceMiles}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="Enter miles for next service"
                  />
                </div>

                {/* Road Tax Cost */}
                <div>
                  <label className="text-[10px]">Road Tax Cost</label>
                  <input
                    type="number"
                    name="roadTaxCost"
                    value={vehicleData.roadTaxCost}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                    placeholder="Enter road tax cost"
                  />
                </div>
              </div>
              {/* {selectedSite && (
                <>
                  <h3 className="font-semibold mt-4">Fleet Entry Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-4">
                    <div>
                      <label className="block">Date Fleet Entry</label>
                      <input
                        type="date"
                        name="fleetEntryDate"
                        value={vehicleData.fleetEntryDate}
                        onChange={handleChange}
                        placeholder="Enter fleet entry date"
                        className="w-full p-2 border border-[#42506666] rounded-[4px]"
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
                        className="w-full p-2 border border-[#42506666] rounded-[4px]"
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
                        className="w-full p-2 border border-[#42506666] rounded-[4px]"
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
                        className="w-full p-2 border border-[#42506666] rounded-[4px]"
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
                        className="w-full p-2 border border-[#42506666] rounded-[4px]"
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
                        className="w-full p-2 border border-[#42506666] rounded-[4px]"
                      />
                    </div>
                  </div>
                </>
              )} */}
              {/* <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-4"> */}


              {/* <div>
                  <div className="flex gap-1">
                    <label className=" font-semibold">Editable Color</label>
                  </div>
                  <input
                    type="text"
                    name="editablecolor"
                    value={vehicleData.editablecolor}
                    onChange={handleChange}
                    placeholder="Enter custom color"
                    className="w-full p-2 border border-[#42506666] rounded-[4px]"
                  />
                </div> */}
              {/* </div> */}

              {/* <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-4"> */}


              {/* Seats */}
              {/* <div>
                  <label className="block font-semibold">Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={vehicleData.seats}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded-[4px]"
                    placeholder="Enter number of seats"
                  />
                </div> */}


              {/* </div> */}
              <div className="mt-6 flex  justify-between">
                <button
                  onClick={prevStep}
                  className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                >
                  Back
                </button>
                <div className="flex justify-end gap-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetForm();
                      cancleimages();
                    }}
                    className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                  >
                    Close
                  </button>
                  <button
                    onClick={nextStep}
                    className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="font-bold mb-4">
                Financials Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 ">
                <div className="mb-1">
                  <label className="text-[10px]">
                    List Price (P11D)
                  </label>
                  <input
                    type="number"
                    name="listPrice"
                    value={vehicleData.listPrice}
                    onChange={handleChange}
                    placeholder="List Price"
                    className="w-full p-2 border border-[#42506666] rounded  shadow"
                  />
                </div>

                <div className="mb-1">
                  <label className="text-[10px]">
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={vehicleData.purchasePrice}
                    onChange={handleChange}
                    placeholder="Purchase Price"
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                <div className="mb-1">
                  <label className="text-[10px]">
                    Insurance Value
                  </label>
                  <input
                    type="number"
                    name="insuranceValue"
                    value={vehicleData.insuranceValue}
                    onChange={handleChange}
                    placeholder="Insurance Value"
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                <div className="mb-1">
                  <label className="text-[10px]">
                    Department Code
                  </label>
                  <input
                    type="text"
                    name="departmentCode"
                    value={vehicleData.departmentCode}
                    onChange={handleChange}
                    placeholder="Department Code"
                    className="w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>
              </div>

              <div className="flex items-center justify-start gap-2 my-3">
                <label className="block text-gray-700 font-semibold">
                  Maintenance Record (if any )
                </label>
                <input
                  type="checkbox"
                  name="maintenance"
                  checked={maintenance}
                  onChange={handleMaintenanceToggle}
                />
              </div>
              {maintenance && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="mb-4 col-span-2">
                      <label className="text-[10px]">
                        Issues / Damages
                      </label>
                      <input
                        type="text"
                        name="issues_damage"
                        value={vehicleData.issues_damage}
                        onChange={handleChange}
                        placeholder="Describe"
                        className="w-full p-2 border border-[#42506666] rounded shadow"
                      />
                    </div>

                    {/* <div className="mb-4 col-span-1">
                      <label className="text-[10px]">
                        Damage Image
                      </label>
                      <div className="border-2 border-dashed border-[#42506666] rounded shadow p-2">
                        <input
                          type="file"
                          id="damage_image"
                          name="damage_image"
                          onChange={handleChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:background-gray-100 hover:file:bg-gray-200 file:text-sm"
                          multiple
                        />
                      </div>
                    </div> */}
                    <div className="mb-4 col-span-1">
                      <label
                        htmlFor="useravatar"
                        className="text-[10px]"
                      >
                        Damage Image
                      </label>
                      <input
                        type="file"
                       id="damage_image"
                          name="damage_image"
                        accept="image/*"
                        onChange={handleChange}
                        className=" block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                      />
                    </div>
                  </div>


                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                    <div className="mb-4">
                      <label className="text-[10px]">
                        Recovery
                      </label>
                      <input
                        type="text"
                        name="recovery"
                        value={vehicleData.recovery}
                        onChange={handleChange}
                        placeholder="Recovery"
                        className="w-full p-2 border border-[#42506666] rounded shadow"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-[10px]">
                        Repair Status
                      </label>
                      <input
                        type="text"
                        name="repairStatus"
                        value={vehicleData.repairStatus}
                        onChange={handleChange}
                        placeholder="Repair status"
                        className="w-full p-2 border border-[#42506666] rounded shadow"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-[10px]">
                        Job Number
                      </label>
                      <input
                        type="text"
                        name="jobNumber"
                        value={vehicleData.jobNumber}
                        onChange={handleChange}
                        placeholder="Job number"
                        className="w-full p-2 border border-[#42506666] rounded shadow"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-[10px]">
                        Organization
                      </label>
                      <select
                        name="organization"
                        value={vehicleData.organization}
                        onChange={handleChange}
                        className="w-full p-2 border border-[#42506666] rounded shadow"
                      >
                        <option value="">Select Organization</option>
                        <option value="Organization1">Organization 1</option>
                        <option value="Organization2">Organization 2</option>
                      </select>
                    </div>





                    <div className="mb-4">
                      <label className="text-[10px]">
                        Memo
                      </label>
                      <input
                        type="text"
                        name="memo"
                        value={vehicleData.memo}
                        onChange={handleChange}
                        placeholder="Memo for repair"
                        className="w-full p-2 border border-[#42506666] rounded shadow"
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">Parts</h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-4 mb-2">
                    <div>
                      <input
                        type="text"
                        name="partNumber"
                        value={vehicleData.partNumber}
                        onChange={handleChange}
                        placeholder="Part Number"
                        className="w-full p-2 border border-[#42506666] rounded shadow mb-2"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="partName"
                        value={vehicleData.partName}
                        onChange={handleChange}
                        placeholder="Part Name"
                        className="w-full p-2 border border-[#42506666] rounded shadow mb-2"
                      />
                    </div>

                    <div>
                      <input
                        type="number"
                        name="partprice"
                        value={vehicleData.partprice}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full p-2 border border-[#42506666] rounded shadow mb-2"
                      />
                    </div>

                    <div>
                      <select
                        name="partsupplier"
                        value={vehicleData.partsupplier}
                        onChange={handleChange}
                        className="w-full p-2 border border-[#42506666] rounded shadow mb-2"
                      >
                        <option value="">Select Supplier</option>
                        <option value="Supplier1">Supplier 1</option>
                        <option value="Supplier2">Supplier 2</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <h2 className="font-bold mb-4">Commercial Vehicles</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
                <div>
                  <label className="text-[10px]">RPC Expiry Date</label>
                  <input
                    type="date"
                    name="RPCExpiryDate"
                    value={vehicleData.RPCExpiryDate}
                    onChange={handleChange}
                    className="w-full border border-[#42506666] rounded shadow p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">
                    Tail-Lift Expiry Date
                  </label>
                  <input
                    type="date"
                    name="TailLiftExpiryDate"
                    value={vehicleData.tailLiftExpirydate}
                    onChange={handleChange}
                    className="w-full border border-[#42506666] rounded shadow p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">
                    Fork Lift Inspection Date
                  </label>
                  <input
                    type="date"
                    name="ForkLiftInspectionDate"
                    value={vehicleData.ForkLiftInspectionDate}
                    onChange={handleChange}
                    className="w-full border border-[#42506666] rounded shadow p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">
                    Fork Lift Inspection Number/Notes
                  </label>
                  <input
                    type="text"
                    name="ForkLiftInspectionNumberNotes"
                    value={vehicleData.forkLiftNumber}
                    onChange={handleChange}
                    placeholder="Inspection number or notes"
                    className="w-full border border-[#42506666] rounded shadow p-2"
                  />
                </div>
              </div>
              {/* Toggle for self-fit setting */}
              <div className="flex items-center">
                <label className="text-[10px]">
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
                    Additional Info
                  </label>
                  <textarea
                    value={vehicleData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Enter any additional info"
                    className="w-full border border-[#42506666] rounded shadow p-2"
                    rows="2"
                  />
                </div>
              )}

              <div className="mt-6 flex gap-2 justify-between">
                <button
                  onClick={prevStep}
                  className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                >
                  Back
                </button>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetForm();
                      cancleimages();
                    }}
                    className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                  >
                    Close
                  </button>
                  <button
                    onClick={nextStep}
                    className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="font-bold">Local Authority</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
                <div>
                  <div>
                    <label htmlFor="taxiFirm" className="text-[10px]">
                      Taxi Local Authority <span className="text-red-600">*</span>
                    </label>

                  </div>
                  <select
                    id="LocalAuthority"
                    name="LocalAuthority"
                    value={vehicleData.LocalAuthority}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#42506666] rounded-[4px]"
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
                <div>
                  <label className="text-[10px]">Test Date</label>
                  <input
                    type="date"
                    name="TestDate"
                    value={vehicleData.TestDate}
                    onChange={handleChange}
                    className="w-full border border-[#42506666] rounded-[4px] p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">
                    Plate Expiry Date
                  </label>
                  <input
                    type="date"
                    name="PlateExpiryDate"
                    value={vehicleData.PlateExpiryDate}
                    onChange={handleChange}
                    className="w-full border border-[#42506666] rounded-[4px] p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">Insurance</label>
                  <input
                    type="text"
                    name="Insurance"
                    value={vehicleData.Insurance}
                    onChange={handleChange}
                    placeholder="Enter insurance details"
                    className="w-full border border-[#42506666] rounded-[4px] p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">
                    Insurance Policy Number:
                  </label>
                  <input
                    type="text"
                    name="insurancePolicyNumber"
                    value={vehicleData.insurancePolicyNumber}
                    onChange={handleChange}
                    placeholder="Enter policy number"
                    className="w-full border border-[#42506666] rounded-[4px] p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">
                    Add PDF/Picture of Policy:
                  </label>
                  <input
                    type="file"
                    name="PDFofPolicy"
                    onChange={handleChange}
                    accept="application/pdf, image/*"
                    className="w-full border border-[#42506666] rounded-[4px] p-2"
                  />
                </div>
              </div>
              <h2 className="font-bold mb-4">Defect Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 mb-2">
                <div>
                  <label className="text-[10px]">Defect</label>
                  <input
                    type="text"
                    name="defect"
                    value={vehicleData.defect}
                    onChange={handleChange}
                    placeholder="Enter defect name"
                    className="w-full border border-[#42506666] rounded-[4px] p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">Date</label>
                  <input
                    type="date"
                    name="Defectdate"
                    value={vehicleData.Defectdate}
                    onChange={handleChange}
                    className="w-full border border-[#42506666] rounded-[4px] p-2"
                  />
                </div>

                <div>
                  <label className="text-[10px]">Status</label>
                  <select
                    name="defectstatus"
                    value={vehicleData.defectstatus}
                    onChange={handleChange}
                    className="w-full border border-[#42506666] rounded-[4px] p-2"
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
                  <label className="text-[10px]">Description</label>
                  <textarea
                    name="defectdescription"
                    value={vehicleData.defectdescription}
                    onChange={handleChange}
                    placeholder="Enter a brief description of the defect"
                    className="w-full border border-[#42506666] rounded-[4px] p-2 resize-none"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="text-[10px]">Action</label>
                  <textarea
                    name="defectaction"
                    value={vehicleData.defectaction}
                    onChange={handleChange}
                    placeholder="Describe the action taken or needed"
                    className="w-full border border-[#42506666] rounded-[4px] p-2 resize-none"
                    rows="3"
                  />
                </div>
              </div>
              <div>
                {/* multiple images  */}
                <h2 className="block font-semibold">Car Documents</h2>
                <div>
                  {" "}
                  <div className="image-file-inputs">
                    <img
                      src="https://www.freeiconspng.com/uploads/file-add-icon-20.png"
                      alt="Add new file input"
                      onClick={addFileInput}
                      className="cursor-pointer mt-3 w-20 h-20 border-2 border-dashed border-gray-400 hover:border-gray-600"
                    />
                    <div className="flex gap-2">
                      {fileInputs.map((inputId, index) => {
                        return (
                          <div
                            key={inputId}
                            className="mt-8 bg-red-400 relative"
                          >
                            <img
                              src={
                                previews[index] ||
                                "https://via.placeholder.com/150"
                              } // Use a URL to display the file if it exists
                              alt={
                                files[index]
                                  ? files[index].name
                                  : "No file selected"
                              }
                              className="avatar-preview w-20 h-20 cursor-pointer rounded-md border border-gray-300 hover:border-gray-500 transition"
                              onClick={() => handleImageClick(index)}
                            />
                            <input
                              name="cardocuments"
                              type="file"
                              onChange={(e) => handleFileChange(e, index)}
                              style={{ display: "none" }} // Hide the file input
                            />
                            {/* <div className="bg-red-400 w-20 h-20">
                            {files[index]
                              ? files[index].name
                              : "No file selected"}
                          </div> */}
                            {!files[index] && (
                              <div
                                className="text-red-500 absolute -top-7 right-0 cursor-pointer hover:bg-red-500 hover:text-white rounded-md w-7 text-center mb-2"
                                onClick={() => removeFileInput(index)} // Remove file input
                              >
                                ✖
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* <button
                     onClick={handleUpload}
                    style={{ marginTop: "10px" }}
                  >
                    Upload Files
                  </button> */}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 mb-2">
                {/* Warranty Information Section */}
                <div className="flex flex-col">
                  <div>
                    <label className="text-[10px]">
                      Warranty Information <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <textarea
                    name="warrantyInfo"
                    value={vehicleData.warrantyInfo}
                    onChange={handleChange}
                    className="border-2 border-dashed border-[#42506666] rounded-[4px]-lg p-5 resize-none" // Added 'resize-none' for better layout control
                    placeholder="e.g., 3 years or 36,000 miles"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px]">Vehicle Images</label>
                  <div className="border-2 border-dashed border-[#42506666] rounded-[4px]-lg p-2">
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
              {/* <div className="flex items-center">
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
              </div> */}

              <div>
                <label className="text-[10px]">Status </label>
                <div className="flex gap-4">
                  {/* Yes Option */}
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={vehicleData.isActive === true}
                      onChange={() =>
                        handleChange({
                          target: { name: "isActive", value: true },
                        })
                      }
                      className="accent-green-500"
                    />
                    <span className="text-xs">Active</span>
                  </label>

                  {/* No Option */}
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={vehicleData.isActive === false}
                      onChange={() =>
                        handleChange({
                          target: { name: "isActive", value: false },
                        })
                      }
                      className="accent-red-500"
                    />
                    <span className="text-xs">InActive</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-between">
                <button
                  onClick={prevStep}
                  className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                >
                  Back
                </button>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetForm();
                      cancleimages();
                    }}
                    className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                  >
                    Close
                  </button>
                  <button
                    className={`bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8 ${isNextDisabled5th
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-custom-bg text-white hover:bg-gray-600"
                      }`} disabled={isNextDisabled5th}           >
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModel;