"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  // fetchTaxiFirms,
  fetchBadge,
  fetchInsurence,
  // fetchLocalAuth,
  // fetchVehicle,
} from "../../Components/DropdownData/taxiFirm/taxiFirmService";
import {
  API_URL_Driver,
  // API_URL_DriverMoreInfo,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";

import {
  getCompanyName,
  getUserId,
  getUserName, getflag, getcompanyId
} from "@/utils/storageUtils";
const AddDriverModal = ({ isOpen, onClose, fetchData }) => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    tel1: "",
    tel2: "",
    postcode: "",
    postalAddress: "",
    city: "",
    county: "",
    dateOfBirth: "",
    licenseNumber: "",
    niNumber: "",
    driverNumber: "",
    taxiFirm: "",
    badgeType: "",
    insurance: "",
    startDate: "",
    driverRent: 0,
    licenseExpiryDate: "",
    taxiBadgeDate: "",
    rentPaymentCycle: "",
    isActive: false,
    imageFile: null,

    // LocalAuth: "",
    vehicle: "",
    // pay: "",
    calculation: 0,
    adminCreatedBy: "",
    adminCompanyName: "",
    companyId: null,
    password: "",
    confirmPassword: "",
    BuildingAndStreetOne: "",
    BuildingAndStreetTwo: "",

  };


  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [badge, setBadge] = useState([]);
  const [insurance, setInsurance] = useState([]);
  // const [localAuth, setlocalAuth] = useState([]);
  const [superadmin, setSuperadmin] = useState(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [validation, setValidation] = useState({
    emailValid: null,
  });



  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  useEffect(() => {
    let storedCompanyName = "";
    let storedSuperadmin = "";

    if (typeof window !== "undefined") {
      // Only access localStorage in the browser environment
      storedCompanyName = localStorage.getItem("companyName") || "";
      storedSuperadmin = localStorage.getItem("role") || "";
    }

    console.log("Stored Company Name:", storedCompanyName);
    console.log("Stored Superadmin Role:", storedSuperadmin);


    if (storedSuperadmin) {
      setSuperadmin(storedSuperadmin);
    }

    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
        confirmPassword: prevData.password
      }));
    }
  }, []);




  useEffect(() => {
    const storedcompanyName = (() => {
      const name1 = getCompanyName();
      if (name1) return name1;

      const name2 = getUserName();
      if (name2) return name2;
    })();
    const userId = getUserId()
    const flag = getflag();
    const compID = getcompanyId();
    // const randomId = randomObjectId();

    console.log(storedcompanyName, userId);
    if (storedcompanyName && userId) {
      // Check if the company is "superadmin" and the flag is true
      if (storedcompanyName.toLowerCase() === "superadmin" && flag === "true" && compID) {
        setFormData((prevData) => ({
          ...prevData,
          companyName: storedcompanyName,
          companyId: compID, // Ensure compID is set
        }));
      } else {
        // Use userId if not in "superadmin" mode
        console.log(userId);
        setFormData((prevData) => ({
          ...prevData,
          companyName: storedcompanyName,
          companyId: userId,
        }));
      }
    } else {
      console.error("Missing required fields:", { storedcompanyName, userId, flag, compID });
    }

  }, [])


  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [

          badgeData,
          insuranceData,
          // localAuth,
        ] = await Promise.all([
          fetchBadge(),
          fetchInsurence(),
          // fetchLocalAuth(),
        ]);

        const storedCompanyName = formData.adminCompanyName;

        const filteredBadges =
          superadmin === "superadmin"
            ? badgeData.result
            : badgeData.result.filter(
              (badge) =>
                badge.adminCompanyName === storedCompanyName ||
                badge.adminCompanyName === "superadmin"
            );

        const filteredInsurance =
          superadmin === "superadmin"
            ? insuranceData.Result
            : insuranceData.Result.filter(
              (insurance) =>
                insurance.adminCompanyName === storedCompanyName ||
                insurance.adminCompanyName === "superadmin"
            );
        // const filteredlocalAuth =
        //   superadmin === "superadmin"
        //     ? localAuth.Result
        //     : localAuth.Result.filter(
        //       (localAuth) =>
        //         localAuth.adminCompanyName === storedCompanyName ||
        //         localAuth.adminCompanyName === "superadmin"
        //     );


        setBadge(filteredBadges);
        setInsurance(filteredInsurance);
        // setlocalAuth(filteredlocalAuth);

      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    loadDropdownData();
  }, [superadmin, formData.adminCompanyName]);

  // const handleChange = (e) => {
  //   const { name, value, type, checked, files } = e.target;

  //   // Determine the updated value based on the input type
  //   const updatedValue = type === "checkbox"
  //     ? checked
  //     : type === "file"
  //       ? files[0]
  //       : value;

  //   // Update form data state
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: updatedValue,
  //   }));

  //   // Handle email validation if the field name is "email"
  //   if (name === "email") {
  //     setValidation((prevValidation) => ({
  //       ...prevValidation,
  //       emailValid: emailRegex.test(updatedValue),
  //     }));
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let updatedValue = type === "checkbox"
      ? checked
      : type === "file"
        ? files[0]
        : name === "firstName"
          ? value.replace(/\s+/g, '') // Remove spaces for firstName
          : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));

    if (name === "email") {
      setValidation((prevValidation) => ({
        ...prevValidation,
        emailValid: emailRegex.test(updatedValue),
      }));
    }
  };

  const pageonerequiredfeilds = [
    "firstName",
    // "lastName",
    "email",
    "tel1",
    "licenseNumber",
    "niNumber",
  ];
  // const pagetworequiredfeilds = [
  //   "licenseExpiryDate",
  //   "taxiBadgeDate",
  //   "city",
  //   "LocalAuth",
  //   "county",
  //   "postcode",
  //   "postalAddress",
  // ];

  const areFieldsFilled = (fields) =>
    fields.every((field) => formData[field]?.trim() !== "");

  // Determine if the "Next" button should be disabled
  const isNextDisabled1st =
    !validation.emailValid || !areFieldsFilled(pageonerequiredfeilds);
  // const isNextDisabled2nd = !areFieldsFilled(pagetworequiredfeilds);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(`${API_URL_Driver}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(response);
      if (response.data.success) {
        try {
          // console.log(selectedvehicle);
          // const formDataToSend = new FormData();
          // const specificFieldKeyvehicleStatus = "vehicleStatus";
          // formDataToSend.set(specificFieldKeyvehicleStatus, "Rend");
          // if (formData) {
          //   Object.keys(formData).forEach((key) => {
          //     if (key !== specificFieldKeyvehicleStatus) {
          //       formDataToSend.append(key, formData[key]);
          //     }
          //   });
          // }
          // const res = await axios.put(
          //   `${API_URL_DriverMoreupdate}/${selectedUserId}`,
          //   formDataToSend,
          //   {
          //     headers: {
          //       "Content-Type": "multipart/form-data",
          //     },
          //   }
          // );
          // console.log(res);
          // const newRecordData = {
          //   driverId: response.data.savedDriver._id, // Add your specific fields here
          //   vehicle: response.data.savedDriver.vehicle, // Add your specific fields here
          //   paymentcycle: response.data.savedDriver.rentPaymentCycle, // Add your specific fields here
          //   startDate: response.data.savedDriver.startDate, // Add your specific fields here
          //   calculation: response.data.savedDriver.pay, // Add your specific fields here
          //   endDate: "", // Add your specific fields here
          //   subtractcalculation: 0, // Add your specific fields here
          //   remaining: 0, // Add your specific fields here
          //   totalamount: 0,
          //   totalsubtractamount: 0,
          //   totalremainingamount: 0,
          //   adminCreatedBy: "", // Add your specific fields here
          //   adminCompanyName: response.data.savedDriver.adminCompanyName, // Keep existing field
          // };
          // const newRecordResponse = await axios.post(
          //   `${API_URL_DriverMoreInfo}`,
          //   newRecordData
          // );
          // console.log(newRecordResponse);
        } catch (error) {
          console.log(error);
        }
        //

        //
        const initialFormData = {
          firstName: "",
          lastName: "",
          email: "",
          tel1: "",
          tel2: "",
          postcode: "",
          postalAddress: "",
          // permanentAddress: "",
          city: "",
          county: "",
          dateOfBirth: "",
          licenseNumber: "",
          niNumber: "",
          driverNumber: "",
          taxiFirm: "",
          badgeType: "",
          insurance: "",
          startDate: "",
          driverRent: 0,
          licenseExpiryDate: "",
          taxiBadgeDate: "",
          rentPaymentCycle: "",
          isActive: false,
          imageFile: null,
          LocalAuth: "",
          vehicle: "",
          // pay: 0,
          calculation: "",
          adminCreatedBy: "",
          password: "",
          confirmPassword: "",
          Postcode: "",
          BuildingAndStreetOne: "",
          BuildingAndStreetTwo: "",
          adminCompanyName: formData.adminCompanyName,
        };
        toast.success(response.data.message);
        fetchData();
        onClose();
        setFormData(initialFormData);

        //

        //
      } else {
        toast.warn(response.data.error);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <h3 className="text-xl font-semibold mb-2">Driver Details</h3> */}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Add Driver
            </h2>

            <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
              onClose();
              setStep(1);
            }} />
          </div>
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  {/* <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name:
                    </label>
                    <span className="text-red-600">*</span> */}
                  <div className="flex gap-1 items-center justify-start">
                    <label
                      htmlFor="firstName"
                      className="text-[10px]"
                      
                    >
                      Name <span className="text-red-600">*</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                  />
                </div>

                <div>
                  {/* <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name:
                    </label>
                    <span className="text-red-600">*</span> */}
                  <div className="flex gap-1 items-center justify-start">
                    <label
                      htmlFor="dateOfBirth"
                      className="text-[10px]"
                    >
                      Date of Birth
                      {/* <span className="text-red-600">*</span> */}
                    </label>
                  </div>

                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    {/* <label
                      htmlFor="niNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      NI Number:
                    </label>

                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="niNumber"
                      className="text-[10px]"
                    >
                      NI Number <span className="text-red-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    id="niNumber"
                    name="niNumber"
                    value={formData.niNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                    placeholder="Ni Number"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    {/* <label
                      htmlFor="licenseNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      License Number:
                    </label>

                    <span className="text-red-600">*</span> */}
                    <label
                      htmlFor="licenseNumber"
                      className="text-[10px]"
                    >
                      License Number <span className="text-red-600">*</span>
                    </label>

                  </div>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                    placeholder="License Number"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <div className="flex gap-1">
                      <label
                        htmlFor="email"
                        className="text-[10px]"
                      >
                        Email
                        {/* <span className="text-red-600">*</span> */}
                      </label>
                    </div>
                  </div>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                    placeholder="Email"
                  />
                </div>

                {/* added new */}
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="password"
                      className="text-[10px]"
                    >
                      Password
                      {/* <span className="text-red-600">*</span> */}
                    </label>
                  </div>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                    placeholder="Password"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <div className="flex gap-1">
                      <label
                        htmlFor="tel1"
                        className="text-[10px]"
                      >
                        Phone number
                        {/* <span className="text-red-600">*</span> */}
                      </label>
                    </div>
                  </div>

                  <input
                    type="tel"
                    id="tel1"
                    name="tel1"
                    placeholder="Phone Number"
                    value={formData.tel1}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="driverNumber"
                      className="text-[10px]"
                    >
                      Driver Number
                    </label>
                  </div>
                  <input
                    type="text"
                    id="driverNumber"
                    name="driverNumber"
                    placeholder="Driver Number"
                    value={formData.driverNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                  />
                </div>

                {/* <div>
                  <label
                    htmlFor="tel2"
                    className="text-[10px]"
                  >
                    Tel 2
                  </label>
                  <input
                    type="tel"
                    id="tel2"
                    name="tel2"
                    value={formData.tel2}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                  />
                </div> */}



                {/* <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="licenseNumber"
                      className="text-[10px]"
                    >
                      License Number <span className="text-red-600">*</span>
                    </label>

                  </div>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                    required
                  />
                </div> */}




                <div>
                  <label
                    htmlFor="badgeType"
                    className="text-[10px]"
                  >
                    Badge Type
                  </label>
                  <select
                    id="badgeType"
                    name="badgeType"
                    value={formData.badgeType}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                  >
                    <option value="null">Select badgeType </option>
                    {badge.map((badge) => (
                      <option key={badge._id} value={badge.name}>
                        {badge.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="insurance"
                    className="text-[10px]"
                  >
                    Insurance
                  </label>
                  <select
                    id="insurance"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                  >
                    <option value="null">Select insurance </option>

                    {insurance.map((insurence) => (
                      <option key={insurence._id} value={insurence.name}>
                        {insurence.name}
                      </option>
                    ))}
                  </select>
                </div>



                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="licenseExpiryDate"
                      className="text-[10px]"
                    >
                      License Expiry Date
                    </label>
                  </div>

                  <input
                    type="date"
                    id="licenseExpiryDate"
                    name="licenseExpiryDate"
                    value={formData.licenseExpiryDate}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                  />
                </div>
              </div>

              {/* buttons */}
              <div className="mt-6 flex gap-[10px] justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    // resetform();
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
                    }`}
                  disabled={isNextDisabled1st}
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-bold">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* <div>
                <label
                  htmlFor="taxiFirm"
                  className="text-sm font-medium text-gray-700"
                >
                  Taxi Firm:
                </label>
                <select
                  id="taxiFirm"
                  name="taxiFirm"
                  value={formData.taxiFirm}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="null">Select Taxi Firm</option>
                  {taxiFirms.map((firm) => (
                    <option key={firm._id} value={firm.name}>
                      {firm.name}
                    </option>
                  ))}
                </select>
              </div> */}
                {/* <div>
                  <label
                    htmlFor="taxiFirm"
                    className="text-sm font-medium text-gray-700"
                  >
                    Driver Localauthority:
                  </label>
                  <span className="text-red-600">*</span>
                  <select
                    id="LocalAuth"
                    name="LocalAuth"
                    value={formData.LocalAuth}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="null">Select Localauthority</option>
                    {localAuth.map((local) => (
                      <option key={local._id} value={local.name}>
                        {local.name}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* <div>
                <label
                  htmlFor="taxiFirm"
                  className="text-sm font-medium text-gray-700"
                >
                  Vehicle:
                </label>
                <select
                  id="vehicle"
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={(e) => {
                    // Get the selected vehicle's model and pass it to formData
                    const selectedModel = e.target.value;

                    // Find the selected vehicle's ID based on the selected model
                    const selectedVehicle = filteredVehicles.find(
                      (vehicle) => vehicle.model === selectedModel
                    );

                    // Update the formData with the selected vehicle's model
                    handleChange(e);

                    // Call selectedvehicle with the vehicle's _id
                    if (selectedVehicle) {
                      setselectedvehicle(selectedVehicle._id);
                    }
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="null">Select vehicle</option>
                  {vehicle.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle.model}>
                      {vehicle.model}
                    </option>
                  ))}
                </select>
              </div> */}

                {/* <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Start Date:
                  </label>
                  <span className="text-red-600">*</span>
                </div>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="driverRent"
                    className="text-sm font-medium text-gray-700"
                  >
                    Driver Rent:
                  </label>
                  <span className="text-red-600">*</span>
                </div>
                <input
                  type="number"
                  id="driverRent"
                  name="driverRent"
                  value={formData.driverRent}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div> */}

                {/* <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="taxiBadgeDate"
                      className="text-sm font-medium text-gray-700"
                    >
                      Taxi Badge Date:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="date"
                    id="taxiBadgeDate"
                    name="taxiBadgeDate"
                    value={formData.taxiBadgeDate}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div> */}
                {/* <div>
                <div className="flex gap-1">
                  <label
                    htmlFor="rentPaymentCycle"
                    className="text-sm font-medium text-gray-700"
                  >
                    Rent Payment Cycle:
                  </label>

                  <span className="text-red-600">*</span>
                </div>
                <select
                  id="rentPaymentCycle"
                  name="rentPaymentCycle"
                  value={formData.rentPaymentCycle}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Payment</option>
                  <option value="perday">Per Day</option>
                  <option value="perweek">Per Week</option>
                  <option value="permonth">per Month</option>
                  <option value="perquarter">Per Quarter</option>
                  <option value="peryear">per year</option>
                </select>
              </div> */}
                {/* <div>
                <label
                  htmlFor="pay"
                  className="text-sm font-medium text-gray-700"
                >
                  Payment:
                </label>
                <input
                  type="number"
                  id="pay"
                  name="pay"
                  value={formData.pay}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div> */}

                {/* added new */}
                <div>
                  <div className="flex gap-1">
                    <label
                      // htmlFor="postalAddress"
                      className="text-[10px]"
                    >
                      Building and Street (Line 1 of 2)
                    </label>

                    {/* <span className="text-red-600">*</span> */}
                  </div>
                  <input
                    type="text"
                    id="Building&Street"
                    name="BuildingAndStreetOne"
                    value={formData.BuildingAndStreetOne}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                    placeholder="Building and Street"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label
                      // htmlFor="postalAddress"
                      className="text-[10px]"
                    >
                      Building and Street (Line 2 of 2)
                    </label>

                    {/* <span className="text-red-600">*</span> */}
                  </div>
                  <input
                    type="text"
                    id="Building&Street2"
                    name="BuildingAndStreetTwo"
                    value={formData.BuildingAndStreetTwo}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                    placeholder="Building and Street"
                  />
                </div>

                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="city"
                      className="text-[10px]"
                    >
                      Town/City
                    </label>

                    {/* <span className="text-red-600">*</span> */}
                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required placeholder="Town/City"
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="county"
                      className="text-[10px]"
                    >
                      Country
                    </label>

                    {/* <span className="text-red-600">*</span> */}
                  </div>
                  <input
                    type="text"
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="postcode"
                      className="text-[10px]"
                    >
                      Postcode
                    </label>

                    {/* <span className="text-red-600">*</span> */}
                  </div>

                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px]">Status</label>
                  <div className="flex gap-4 mt-2">
                    {/* Yes Option */}
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="isActive"
                        value="true"
                        checked={formData.isActive === true}
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
                        checked={formData.isActive === false}
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
                {/* <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="postalAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Postal Address:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="text"
                    id="postalAddress"
                    name="postalAddress"
                    value={formData.postalAddress}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div> */}
                {/* <div>
                <label
                  htmlFor="permanentAddress"
                  className="text-sm font-medium text-gray-700"
                >
                  Permanent Address:
                </label>

                <input
                  type="text"
                  id="permanentAddress"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div> */}
                {/* </div> */}
                {/* </div> */}
                <div className="">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="image"
                      className="text-[10px]"
                    >
                      Upload Image:
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                    />
                  </div>
                  {/* <h3 className="text-sm font-medium text-gray-700">
                    Upload Document
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 mt-2">
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      onChange={handleChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:background-gray-100 hover:file:bg-gray-200 file:text-sm"
                    />
                  </div> */}
                  {/* <div>
              <h3 className="text-sm font-medium text-gray-700">
                Document Name
              </h3>

              <input
                type="text"
                id="imageName"
                name="imageName"
                value={formData.imageName}
                onChange={handleChange}
                placeholder="Image Name"
                className="border-2 border-dashed border-gray-300 rounded-lg p-2 h-14 w-full mt-2"
              />
            </div> */}
                  {/* <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
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
                </div>

              </div>


              <div className="mt-10 flex gap-2 justify-between">
                <div>
                  <button
                    onClick={prevStep}
                    className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                  >
                    Back
                  </button>
                </div>
                <div className="flex gap-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      // resetform();
                    }}
                    className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8 "             
                      }`}
                  >
                    {loading ? "Submitting..." : "Submit"}
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

export default AddDriverModal;
