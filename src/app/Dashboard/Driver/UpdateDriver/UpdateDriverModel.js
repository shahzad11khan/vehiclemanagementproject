"use client";
import React, { useEffect, useState } from "react";
import { API_URL_Driver } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import {
  // fetchTaxiFirms,
  fetchBadge,
  fetchInsurence,
  fetchLocalAuth,
  // fetchVehicle,
} from "../../Components/DropdownData/taxiFirm/taxiFirmService";
import { getCompanyName, getUserRole } from "@/utils/storageUtils";

const UpdateDriverModel = ({ isOpen, onClose, fetchDataa, selectedUserId }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    tel1: "",
    tel2: "",
    postcode: "",
    postalAddress: "",
    permanentAddress: "",
    city: "",
    county: "",
    dateOfBirth: "",
    reportsTo: "",
    passwordExpires: "",
    passwordExpiresEvery: "",
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
    imageName: "",
    imageFile: null,
    // pay: 0,
    calculation: "",
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  // const [taxiFirms, setTaxiFirms] = useState([]);
  const [badge, setBadge] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [localAuth, setLocalAuth] = useState([]);
  // const [vehicle, setVehicle] = useState([]);
  const [superadmin, setSuperadmin] = useState(null);
  const [step, setStep] = useState(1);
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  // const [filteredVehicles, setFilteredVehicles] = useState([]);

  useEffect(() => {
    const storedCompanyName = getCompanyName();
    const storedSuperadmin = getUserRole();
    if (storedSuperadmin) {
      setSuperadmin(storedSuperadmin);
    }
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []);

  const fetchData = async () => {
    // console.log(selectedUserId);
    try {
      const res = await axios.get(`${API_URL_Driver}/${selectedUserId}`);
      const adminData = res.data.result;

      // console.log("Fetched admin data:", adminData);

      setFormData((prevData) => ({
        ...prevData,
        ...adminData,
      }));

      setImagePreview(adminData.imageFile);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchData();
    }

    const loadTaxiFirms = async () => {
      try {
        const [
          // taxiFirmData,
          badgeData,
          insuranceData,
          localAuthData,
          // vehicle
        ] = await Promise.all([
          // fetchTaxiFirms(),
          fetchBadge(),
          fetchInsurence(),
          fetchLocalAuth(),
          // fetchVehicle(),
        ]);

        const storedCompany = getCompanyName();
        // console.log(storedCompanyName);

        // const filteredTaxiFirms =
        //   superadmin === "superadmin"
        //     ? taxiFirmData.result
        //     : taxiFirmData.result.filter(
        //         (firm) =>
        //           firm.adminCompanyName === storedCompanyName ||
        //           firm.adminCompanyName === "superadmin"
        //       );
        const filteredBadges =
          superadmin === "superadmin"
            ? badgeData.result
            : badgeData.result.filter(
                (badge) =>
                  badge.adminCompanyName === storedCompany ||
                  insurance.adminCompanyName === "superadmin"
              );

        // console.log(filteredBadges);
        const filteredInsurance =
          superadmin === "superadmin"
            ? insuranceData.Result
            : insuranceData.Result.filter(
                (insurance) =>
                  insurance.adminCompanyName === storedCompany ||
                  insurance.adminCompanyName === "superadmin"
              );

        const filteredLocalAuth =
          superadmin === "superadmin"
            ? localAuthData.Result
            : localAuthData.Result.filter(
                (localAuth) =>
                  localAuth.adminCompanyName === storedCompany ||
                  localAuth.adminCompanyName === "superadmin"
              );

        // const filteredVehicle =
        //   superadmin === "superadmin"
        //     ? vehicle.result
        //     : vehicle.result.filter(
        //         (vehicle) =>
        //           vehicle.adminCompanyName === storedCompanyName ||
        //           vehicle.adminCompanyName === "superadmin"
        //       );

        // setTaxiFirms(filteredTaxiFirms);
        setBadge(filteredBadges);
        setInsurance(filteredInsurance);
        setLocalAuth(filteredLocalAuth);
        // setVehicle(filteredVehicle);
      } catch (error) {
        console.error("Error loading taxi firms:", error);
      }
    };

    loadTaxiFirms();
  }, [selectedUserId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));

    if (type === "file" && files.length) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
    }

    // if (name === "LocalAuth") {
    //   const matchedVehicles = vehicle.filter(
    //     (vehicle) => vehicle.LocalAuthority === value
    //   );
    //   setFilteredVehicles(matchedVehicles);
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    if (formData.imageFile) {
      formDataToSend.append("imageFile", formData.imageFile);
    }

    try {
      const response = await fetch(`${API_URL_Driver}/${selectedUserId}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const data = await response.json();
      console.log("Update successful:", data);
      if (data.success) {
        fetchDataa();
        onClose();
        toast.success(data.message);
      } else {
        toast.success(data.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Update Driver
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-semibold mb-2">Driver Details</h3>
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name:
                    </label>
                    <span className="text-red-600">*</span>
                  </div>

                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name:
                    </label>
                    <span className="text-red-600">*</span>
                  </div>

                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date of Birth:
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="tel1"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tel 1:
                    </label>
                    <span className="text-red-600">*</span>
                  </div>

                  <input
                    type="tel"
                    id="tel1"
                    name="tel1"
                    value={formData.tel1}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="tel2"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tel 2:
                  </label>
                  <input
                    type="tel"
                    id="tel2"
                    name="tel2"
                    value={formData.tel2}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address:
                    </label>
                    <span className="text-red-600">*</span>
                  </div>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="licenseNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      License Number:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="niNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      NI Number:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="text"
                    id="niNumber"
                    name="niNumber"
                    value={formData.niNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="driverNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Driver Number:
                    </label>
                  </div>
                  <input
                    type="text"
                    id="driverNumber"
                    name="driverNumber"
                    value={formData.driverNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    // resetform();
                  }}
                  className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Close
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                <div>
                <label
                  htmlFor="taxiFirm"
                  className="text-sm font-medium text-gray-700"
                >
                  Driver Localauthority:
                </label>
                <select
                  id="LocalAuth"
                  name="LocalAuth"
                  value={formData.LocalAuth}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="null">Select Localauthority</option>
                  {localAuth.map((local) => (
                    <option key={local._id} value={local.name}>
                      {local.name}
                    </option>
                  ))}
                </select>
              </div>

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
                <div>
                  <label
                    htmlFor="badgeType"
                    className="text-sm font-medium text-gray-700"
                  >
                    Badge Type:
                  </label>
                  <select
                    id="badgeType"
                    name="badgeType"
                    value={formData.badgeType}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
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
                    className="text-sm font-medium text-gray-700"
                  >
                    Insurance:
                  </label>
                  <select
                    id="insurance"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="null">Select insurance </option>

                    {insurance.map((insurence) => (
                      <option key={insurence._id} value={insurence.name}>
                        {insurence.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="licenseExpiryDate"
                      className="text-sm font-medium text-gray-700"
                    >
                      License Expiry Date:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>

                  <input
                    type="date"
                    id="licenseExpiryDate"
                    name="licenseExpiryDate"
                    value={formData.licenseExpiryDate}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
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
                </div>
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
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium text-gray-700"
                    >
                      City:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="county"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>
                  <input
                    type="text"
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <div className="flex gap-1">
                    <label
                      htmlFor="postcode"
                      className="text-sm font-medium text-gray-700"
                    >
                      Postcode:
                    </label>

                    <span className="text-red-600">*</span>
                  </div>

                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
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
                </div>
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
                  <h3 className="text-sm font-medium text-gray-700">
                    Driver Image
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 mt-2">
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      onChange={handleChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:background-gray-100 hover:file:bg-gray-200 file:text-sm"
                    />
                  </div>
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
                <div>
                  <label className="block font-medium mb-2">Is Active:</label>
                  <div className="flex gap-4">
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
                      <span>Active</span>
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
                      <span>InActive</span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt={imagePreview}
                    className="h-28 w-28"
                  />
                )}
              </div>
              <div className="mt-6 flex gap-2 justify-between">
                <div>
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Back
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      // resetform();
                    }}
                    className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
                  >
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

export default UpdateDriverModel;
