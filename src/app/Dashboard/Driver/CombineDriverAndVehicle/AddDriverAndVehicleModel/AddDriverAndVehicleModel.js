"use client";
import {
  API_URL_Driver,
  API_URL_Driver_Vehicle_Allotment,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchTaxiFirms,
  fetchLocalAuth,
  fetchVehicle,
} from "../../../Components/DropdownData/taxiFirm/taxiFirmService";
import {
  getCompanyName,
  getsuperadmincompanyname,
  getUserRole,
} from "@/utils/storageUtils";

const AddDriverMoreInfoModal = ({
  isOpen,
  onClose,
  fetchData,
  selectedUserId,
}) => {
  const [formData, setFormData] = useState({
    driverId: "",
    driverName: "",
    startDate: "",
    taxifirm: "",
    taxilocalauthority: "",
    vehicle: "",
    paymentcycle: "",
    payment: "",
    adminCreatedBy: "",
    adminCompanyName: "",
    adminCompanyId: "",
  });

  const [loading, setLoading] = useState(false);
  const [taxiFirms, setTaxiFirms] = useState([]);
  const [localAuth, setLocalAuth] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [superadmin, setSuperadmin] = useState(null);

  useEffect(() => {
    const storedCompanyName = getCompanyName() || getsuperadmincompanyname();
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

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!selectedUserId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL_Driver}/${selectedUserId}`);
        setFormData((prevData) => ({
          ...prevData,
          driverId: data.result._id,
          driverName: `${data.result.firstName} ${data.result.lastName}`,
        }));
      } catch (err) {
        console.error(
          err.response?.data?.message || "Failed to fetch driver data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [selectedUserId]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [taxiFirmsData, localAuthData, vehicleData] = await Promise.all([
          fetchTaxiFirms(),
          fetchLocalAuth(),
          fetchVehicle(),
        ]);

        const storedCompanyName = getCompanyName();
        const filterByCompany = (data) =>
          superadmin === "superadmin"
            ? data
            : data.filter(
                (item) =>
                  item.adminCompanyName === storedCompanyName ||
                  item.adminCompanyName === "superadmin"
              );

        setTaxiFirms(filterByCompany(taxiFirmsData.result));
        setLocalAuth(filterByCompany(localAuthData.Result));
        setVehicle(filterByCompany(vehicleData.result));
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    loadDropdownData();
  }, [superadmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "taxilocalauthority") {
      const matchedVehicles = vehicle.filter(
        (veh) => veh.LocalAuthority === value
      );
      setFilteredVehicles(matchedVehicles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        API_URL_Driver_Vehicle_Allotment,
        formData
      );
      if (data.success) {
        toast.success(data.message);
        fetchData();
        onClose();
      } else {
        toast.warn(data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add Car Allotment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="driverName"
                className="text-sm font-medium text-gray-700"
              >
                Driver Name:
              </label>
              <input
                type="text"
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="paymentcycle"
                className="text-sm font-medium text-gray-700"
              >
                Rent Payment Cycle:
              </label>
              <select
                id="paymentcycle"
                name="paymentcycle"
                value={formData.paymentcycle}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Payment</option>
                <option value="perday">Per Day</option>
                <option value="perweek">Per Week</option>
                <option value="permonth">Per Month</option>
                <option value="perquarter">Per Quarter</option>
                <option value="peryear">Per Year</option>
              </select>
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="taxifirm"
                className="text-sm font-medium text-gray-700"
              >
                Taxi Firm:
              </label>
              <select
                id="taxifirm"
                name="taxifirm"
                value={formData.taxifirm}
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

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="taxilocalauthority"
                className="text-sm font-medium text-gray-700"
              >
                Taxi Local Authority:
              </label>
              <select
                id="taxilocalauthority"
                name="taxilocalauthority"
                value={formData.taxilocalauthority}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="null">Select Local Authority</option>
                {localAuth.map((local) => (
                  <option key={local._id} value={local.name}>
                    {local.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="vehicle"
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
                <option value="null">Select Vehicle</option>
                {filteredVehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle.model}>
                    {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="payment"
                className="text-sm font-medium text-gray-700"
              >
                Rent Payment Amount:
              </label>
              <input
                type="number"
                id="payment"
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverMoreInfoModal;
