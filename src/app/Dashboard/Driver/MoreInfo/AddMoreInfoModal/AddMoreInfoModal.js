"use client";
import {
  API_URL_DriverMoreInfo,
  API_URL_DriverMoreupdate,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddDriverMoreInfoModal = ({
  isOpen,
  onClose,
  fetchData,
  selectedUserId,
}) => {
  const [formData, setFormData] = useState({
    driverId: "",
    vehicle: "",
    startDate: "",
    paymentcycle: "",
    calculation: "",
    endDate: "",
    subtractcalculation: "",
    totalamount: 0,
    totalsubtractamount: 0,
    totalremainingamount: 0,
    remaining: "",
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchdrivermoreinfoData = async () => {
      setLoading(true);
      if (selectedUserId) {
        console.log(selectedUserId);
        try {
          const response = await axios.get(
            `${API_URL_DriverMoreInfo}/${selectedUserId}`
          );
          console.log("get data: ", response.data);
          const data = response.data.result;
          if (data) {
            setFormData({
              driverId: data._id,
              vehicle: data.vehicle,
              startDate: data.startDate,
              calculation: data.calculation,
              paymentcycle: data.paymentcycle,
              subtractcalculation: "", // Reset this to ensure fresh data
              totalamount: data.totalamount,
              totalsubtractamount: 0,
              totalremainingamount: 0,
              remaining: "", // Reset remaining too
              adminCreatedBy: "",
              adminCompanyName: formData.adminCompanyName,
            });
          } else {
            toast.warn("Failed to fetch manufacturer data");
          }
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch manufacturer data"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchdrivermoreinfoData();
  }, [selectedUserId]);

  // Calculate remaining when calculation or subtractcalculation changes
  useEffect(() => {
    const calculationValue = parseFloat(formData.totalamount) || 0;
    const subtractCalculationValue =
      parseFloat(formData.subtractcalculation) || 0;
    const newRemaining = calculationValue - subtractCalculationValue;
    setFormData((prevData) => ({
      ...prevData,
      remaining: newRemaining,
    }));
  }, [formData.calculation, formData.subtractcalculation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(formData);
    try {
      // update once again
      const formDataToSend = new FormData();
      const specificFieldKeytotalamount = "totalamount";
      const specificFieldKeytotalsubtractamount = "totalsubtractamount";
      const specificFieldKeystarttotalremainingamount = "totalremainingamount";
      const specificFieldKeyendDate = "endDate";
      const specificFieldKeystarttotalremaining = "remaining";

      formDataToSend.set(specificFieldKeytotalamount, formData.remaining);
      formDataToSend.set(
        specificFieldKeytotalsubtractamount,
        formData.subtractcalculation
      );
      formDataToSend.set(
        specificFieldKeystarttotalremainingamount,
        formData.remaining
      );
      formDataToSend.set(specificFieldKeyendDate, formData.endDate);
      formDataToSend.set(
        specificFieldKeystarttotalremaining,
        formData.remaining
      );
      if (formData) {
        Object.keys(formData).forEach((key) => {
          if (
            key !== specificFieldKeytotalamount &&
            key !== specificFieldKeytotalsubtractamount &&
            key !== specificFieldKeystarttotalremainingamount &&
            key !== specificFieldKeyendDate &&
            key !== specificFieldKeystarttotalremaining
          ) {
            formDataToSend.append(key, formData[key]);
          }
        });
      }
      const res = await axios.put(
        `${API_URL_DriverMoreupdate}/${selectedUserId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(true);
      fetchData();
      onClose();
      console.log("driver more info:", res.data);
      // End update
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add driver info");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add Driver Info
        </h2>

        {error && <p className="text-red-600">{error}</p>}
        {success && (
          <p className="text-green-600">Driver info added successfully!</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 px-2 mb-4 hidden">
              <label
                htmlFor="driverId"
                className="text-sm font-medium text-gray-700"
              >
                Driver ID:
              </label>
              <input
                type="text"
                id="driverId"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-full sm:w-1/2 px-2 mb-4 hidden">
              <label
                htmlFor="driverId"
                className="text-sm font-medium text-gray-700"
              >
                Payment Cycle:
              </label>
              <input
                type="text"
                id="paymentcycle"
                name="paymentcycle"
                value={formData.paymentcycle}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="vehicle"
                className="text-sm font-medium text-gray-700"
              >
                Vehicle:
              </label>
              <input
                type="text"
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700"
              >
                Start Date:
              </label>
              <input
                type="text"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="calculation"
                className="text-sm font-medium text-gray-700"
              >
                Remaining Payment:
              </label>
              <input
                type="number"
                id="calculation"
                name="calculation"
                value={formData.totalamount}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="In £"
                // readOnly
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700"
              >
                Paid Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate ? formData.endDate : null}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="subtractcalculation"
                className="text-sm font-medium text-gray-700"
              >
                Paid:
              </label>
              <input
                type="number"
                id="subtractcalculation"
                name="subtractcalculation"
                value={formData.subtractcalculation}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="In £"
                required
              />
            </div>

            <div className="w-full sm:w-1/2 px-2 mb-4">
              <label
                htmlFor="remaining"
                className="text-sm font-medium text-gray-700"
              >
                Remain Payment:
              </label>
              <input
                type="number"
                id="remaining"
                name="remaining"
                value={formData.remaining}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="In £"
                readOnly
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Loading...." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverMoreInfoModal;
