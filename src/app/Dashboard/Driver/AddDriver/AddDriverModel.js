"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  fetchTaxiFirms,
  fetchBadge,
  fetchInsurence,
  fetchLocalAuth,
  fetchVehicle,
} from "../../Components/DropdownData/taxiFirm/taxiFirmService";
import {
  API_URL_Driver,
  API_URL_DriverMoreInfo,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";

const AddDriverModal = ({ isOpen, onClose, fetchData }) => {
  const initialFormData = {
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
    licenseNumber: "",
    niNumber: "",
    driverNumber: "",
    taxiFirm: "",
    badgeType: "",
    insurance: "",
    startDate: "",
    driverRent: "",
    licenseExpiryDate: "",
    taxiBadgeDate: "",
    rentPaymentCycle: "",
    isActive: false,
    imageFile: null,
    LocalAuth: "",
    vehicle: "",
    pay: "",
    calculation: 0,
    adminCreatedBy: "",
    adminCompanyName: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [taxiFirms, setTaxiFirms] = useState([]);
  const [badge, setBadge] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [localAuth, setLocalAuth] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [superadmin, setSuperadmin] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    const storedSuperadmin = localStorage.getItem("role");

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

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [
          taxiFirmsData,
          badgeData,
          insuranceData,
          localAuthData,
          vehicle,
        ] = await Promise.all([
          fetchTaxiFirms(),
          fetchBadge(),
          fetchInsurence(),
          fetchLocalAuth(),
          fetchVehicle(),
        ]);

        const storedCompanyName = formData.adminCompanyName;
        const filteredTaxiFirms =
          superadmin === "superadmin"
            ? taxiFirmsData.result
            : taxiFirmsData.result.filter(
                (firm) =>
                  firm.adminCompanyName === storedCompanyName ||
                  firm.adminCompanyName === "superadmin"
              );

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

        const filteredLocalAuth =
          superadmin === "superadmin"
            ? localAuthData.Result
            : localAuthData.Result.filter(
                (localAuth) =>
                  localAuth.adminCompanyName === storedCompanyName ||
                  localAuth.adminCompanyName === "superadmin"
              );
        const filteredVehicle =
          superadmin === "superadmin"
            ? vehicle.result
            : vehicle.result.filter(
                (vehicle) =>
                  vehicle.adminCompanyName === storedCompanyName ||
                  vehicle.adminCompanyName === "superadmin"
              );

        setTaxiFirms(filteredTaxiFirms);
        setBadge(filteredBadges);
        setInsurance(filteredInsurance);
        setLocalAuth(filteredLocalAuth);
        setVehicle(filteredVehicle);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    loadDropdownData();
  }, [superadmin, formData.adminCompanyName]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
    if (name === "LocalAuth") {
      const matchedVehicles = vehicle.filter(
        (vehicle) => vehicle.LocalAuthority === value
      );
      setFilteredVehicles(matchedVehicles);
    }
  };

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

      console.log(response);
      if (response.data.success) {
        //
        const newRecordData = {
          driverId: response.data.savedDriver._id, // Add your specific fields here
          vehicle: response.data.savedDriver.vehicle, // Add your specific fields here
          paymentcycle: response.data.savedDriver.rentPaymentCycle, // Add your specific fields here
          startDate: response.data.savedDriver.startDate, // Add your specific fields here
          calculation: response.data.savedDriver.pay, // Add your specific fields here
          endDate: "", // Add your specific fields here
          subtractcalculation: 0, // Add your specific fields here
          remaining: 0, // Add your specific fields here
          totalamount: 0,
          totalsubtractamount: 0,
          totalremainingamount: 0,
          adminCreatedBy: "", // Add your specific fields here
          adminCompanyName: response.data.savedDriver.adminCompanyName, // Keep existing field
        };
        const newRecordResponse = await axios.post(
          `${API_URL_DriverMoreInfo}`,
          newRecordData
        );
        console.log(newRecordResponse);
        //
        const initialFormData = {
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
          licenseNumber: "",
          niNumber: "",
          driverNumber: "",
          taxiFirm: "",
          badgeType: "",
          insurance: "",
          startDate: "",
          driverRent: "",
          licenseExpiryDate: "",
          taxiBadgeDate: "",
          rentPaymentCycle: "",
          isActive: false,
          imageFile: null,
          LocalAuth: "",
          vehicle: "",
          pay: "",
          calculation: "",
          adminCreatedBy: "",
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add a Driver
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Driver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                  <span className="text-red-600">*</span>
                </div>
                <input
                  type="text"
                  id="driverNumber"
                  name="driverNumber"
                  value={formData.driverNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
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
              </div>
              <div>
                <label
                  htmlFor="taxiFirm"
                  className="text-sm font-medium text-gray-700"
                >
                  Taxi Localauthority:
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

              <div>
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
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="null">Select vehicle</option>
                  {filteredVehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle.model}>
                      {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>
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
              <div>
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
              </div>
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
              <div>
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
                  <option value="permonth">per Month</option>
                  <option value="perquarter">Per Quarter</option>
                  <option value="peryear">per year</option>
                </select>
              </div>
              <div>
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
              </div>
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
              <div>
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
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Driver Image</h3>

            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={handleChange}
              className="block w-full mt-1 mb-2"
            />
            <input
              type="text"
              id="imageName"
              name="imageName"
              value={formData.imageName}
              onChange={handleChange}
              placeholder="Image Name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-center">
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
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverModal;
