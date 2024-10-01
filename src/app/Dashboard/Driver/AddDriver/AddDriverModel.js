"use client";
import React, { useEffect, useState } from "react";
import { API_URL_Driver } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { toast } from "react-toastify";
import {
  fetchTaxiFirms,
  fetchBadge,
  fetchInsurence,
  fetchPayment,
} from "../../Components/DropdownData/taxiFirm/taxiFirmService";

const AddDriverModal = ({ isOpen, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    title: "",
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
    driverRent: "",
    licenseExpiryDate: "",
    taxiBadgeDate: "",
    rentPaymentCycle: "",
    isActive: false,
    imageName: "",
    imageFile: null,
    pay: "",
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [taxiFirms, setTaxiFirms] = useState([]);
  const [badge, setbadge] = useState([]);
  const [insurence, setinsurence] = useState([]);
  const [payment, setpayment] = useState([]);

  // Retrieve company name from local storage
  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName"); // Replace with the actual key used in localStorage
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []); // Run only once when the component mounts

  useEffect(() => {
    const loadTaxiFirms = async () => {
      try {
        const data = await fetchTaxiFirms(); // Call the service function to fetch data
        const badge = await fetchBadge(); // Call the service function to fetch data
        const insurance = await fetchInsurence(); // Call the service function to fetch data
        const payment = await fetchPayment(); // Call the service function to fetch data
        // console.log(payment.Result);
        setTaxiFirms(data.result);
        setbadge(badge.result);
        setinsurence(insurance.Result);
        setpayment(payment.Result);
      } catch (error) {
        console.error("Error loading taxi firms:", error);
      }
    };

    loadTaxiFirms();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    try {
      // const response = await axios.post(`${API_URL_Driver}`, formData);
      const response = await axios.post(`${API_URL_Driver}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(response.data);
      if (response.data.success) {
        toast.success("data successfully saved");
        setSuccess(true);
        fetchData();
        onClose();
        setFormData({
          title: "",
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
          accessLevel: "",
          dateOfBirth: "",
          passwordExpires: "",
          passwordExpiresEvery: "",
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
          pay: "",
          imageFile: null,
          imageNotes: "",
        });
      } else {
        toast.warn("Data not saved");
      }
      // Handle success or trigger some UI feedback
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add Driver");
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
        {error && <p className="text-red-600">{error}</p>}
        {success && (
          <p className="text-green-600">Driver added successfully!</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Driver Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name:
                </label>
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
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name:
                </label>
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
                <label
                  htmlFor="tel1"
                  className="text-sm font-medium text-gray-700"
                >
                  Tel 1:
                </label>
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
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address:
                </label>
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
                <label
                  htmlFor="licenseNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  License Number:
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="niNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  NI Number:
                </label>
                <input
                  type="text"
                  id="niNumber"
                  name="niNumber"
                  value={formData.niNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="driverNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Driver Number:
                </label>
                <input
                  type="text"
                  id="driverNumber"
                  name="driverNumber"
                  value={formData.driverNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
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
                  {/* <option value="">Select Taxi Firm</option>
                  <option value="firm1">Firm 1</option>
                  <option value="firm2">Firm 2</option>
                  Add more options as needed */}
                  <option value="">Select Taxi Firm</option>
                  {taxiFirms.map((firm) => (
                    <option key={firm._id} value={firm.name}>
                      {firm.name}
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
                  {/* <option value="">Select Badge Type</option>
                  <option value="type1">Type 1</option>
                  <option value="type2">Type 2</option> */}
                  {/* Add more options as needed */}
                  <option value="">Select Taxi Firm</option>
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
                  {/* <option value="">Select Insurance</option>
                  <option value="insurance1">Insurance 1</option>
                  <option value="insurance2">Insurance 2</option> */}
                  {/* Add more options as needed */}
                  <option value="">Select Taxi Firm</option>
                  {insurence.map((insurence) => (
                    <option key={insurence._id} value={insurence.name}>
                      {insurence.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-700"
                >
                  Start Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="driverRent"
                  className="text-sm font-medium text-gray-700"
                >
                  Driver Rent:
                </label>
                <input
                  type="number"
                  id="driverRent"
                  name="driverRent"
                  value={formData.driverRent}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="licenseExpiryDate"
                  className="text-sm font-medium text-gray-700"
                >
                  License Expiry Date:
                </label>
                <input
                  type="date"
                  id="licenseExpiryDate"
                  name="licenseExpiryDate"
                  value={formData.licenseExpiryDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="taxiBadgeDate"
                  className="text-sm font-medium text-gray-700"
                >
                  Taxi Badge Date:
                </label>
                <input
                  type="date"
                  id="taxiBadgeDate"
                  name="taxiBadgeDate"
                  value={formData.taxiBadgeDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="rentPaymentCycle"
                  className="text-sm font-medium text-gray-700"
                >
                  Rent Payment Cycle:
                </label>
                <select
                  id="rentPaymentCycle"
                  name="rentPaymentCycle"
                  value={formData.rentPaymentCycle}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  {/* <option value="">Select Payment Cycle</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option> */}
                  {/* Add more options as needed */}

                  {/* </select> */}
                  <option value="">Select Taxi Firm</option>
                  {payment.map((payment) => (
                    <option key={payment._id} value={payment.name}>
                      {payment.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="rentPaymentCycle"
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
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700"
                >
                  City:
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="county"
                  className="text-sm font-medium text-gray-700"
                >
                  County:
                </label>
                <input
                  type="text"
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="postcode"
                  className="text-sm font-medium text-gray-700"
                >
                  Postcode:
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="postalAddress"
                  className="text-sm font-medium text-gray-700"
                >
                  Postal Address:
                </label>
                <input
                  type="text"
                  id="postalAddress"
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
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

          {/* Image Upload */}
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
            {/* <textarea
              id="imageNotes"
              name="imageNotes"
              value={formData.imageNotes}
              onChange={handleChange}
              placeholder="Image Notes"
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            /> */}
          </div>

          {/* Checkbox for Active Status */}
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

          {/* Submit Button */}
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
