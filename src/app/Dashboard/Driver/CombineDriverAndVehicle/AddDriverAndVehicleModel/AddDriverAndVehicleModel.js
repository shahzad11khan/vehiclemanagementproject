"use client";
import {
  API_URL_Driver,
  API_URL_Driver_Vehicle_Allotment,
  API_URL_DriverMoreInfo,
  API_URL_Vehicle,
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
    vehicleId: "",
    registrationNumber: "",
    paymentcycle: "",
    payment: 0,
    adminCreatedBy: "",
    adminCompanyName: "",
    adminCompanyId: "",
  });

  const [loading, setLoading] = useState(false);
  const [taxiFirms, setTaxiFirms] = useState([]);
  const [localAuth, setLocalAuth] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [superadmin, setSuperadmin] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState("");

  useEffect(() => {
    const storedCompanyName = (() => {
      const name1 = getCompanyName();
      if (name1) return name1;

      const name2 = getsuperadmincompanyname();
      if (name2) return name2;

    })();
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
        const storedCompanyName = getCompanyName();

        const localAuthData = await fetchLocalAuth();
        const taxiFirmsData = await fetchTaxiFirms();
        const vehicleData = await fetchVehicle();

        const filterByCompany = (data) =>
          superadmin === "superadmin"
            ? data
            : data.filter(
              (item) =>
                item.adminCompanyName === storedCompanyName

            );

        // Apply the filter to the fetched data
        const filteredTaxiFirms = filterByCompany(taxiFirmsData.result);
        const filteredLocalAuth = filterByCompany(localAuthData.Result);
        const filteredVehicle = filterByCompany(vehicleData.result);

        setTaxiFirms(filteredTaxiFirms);
        setLocalAuth(filteredLocalAuth);
        setVehicle(filteredVehicle);

        console.log("Filtered Vehicles:", filteredVehicle);
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

    if (name === "vehicle") {
      const selectedVehicle = vehicle.find(
        (vehicle) => vehicle.model === value
      );
      if (selectedVehicle) {
        console.log(selectedVehicle.registrationNumber)
        setVehicleStatus(selectedVehicle._id);
        setFormData((prevFormData) => ({
          ...prevFormData,
          vehicleId: selectedVehicle._id, // Store the vehicle ID
          registrationNumber: selectedVehicle.registrationNumber, // Store the vehicle ID
        }));
      }
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
        const getdata = data.savedDriverVehicleAllotment;
        const newRecordData = {
          driverId: getdata.driverId, // Add your specific fields here
          driverName: getdata.driverName, // Add your specific fields here
          vehicle: getdata.vehicle, // Add your specific fields here
          vehicleId: getdata.vehicleId, // Add your specific fields here
          registrationNumber: getdata.registrationNumber, // Add your specific fields here
          startDate: getdata.startDate, // Add your specific fields here
          paymentcycle: getdata.paymentcycle, // Add your specific fields here
          payment: getdata.payment, // Add your specific fields here
          endDate: "", // Add your specific fields here
          totalamount: 0,
          totalToremain: 0,
          remaining: 0,
          adminCreatedBy: "", // Add your specific fields here
          adminCompanyId: "",
          adminCompanyName: getdata.adminCompanyName, // Keep existing field
        };

        const newRecordResponse = await axios.post(
          `${API_URL_DriverMoreInfo}`,
          newRecordData
        );
        console.log(newRecordResponse);
        const formDataupdate = new FormData();
        formDataupdate.append("vehicleStatus", "Rent");
        const updateResponse = await axios.put(
          `${API_URL_Vehicle}/${vehicleStatus}`,
          formDataupdate, // Pass the FormData object as the request body
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(updateResponse);
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
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Car Allotment
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
          }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="driverName"
                className="text-[10px]"
              >
                Driver Name
              </label>
              <input
                type="text"
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="paymentcycle"
                className="text-[10px]"
              >
                Rent Payment Cycle
                <span className="text-red-600">*</span>
              </label>
              <select
                id="paymentcycle"
                name="paymentcycle"
                value={formData.paymentcycle}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                required
              >
                <option value="">Select Payment</option>
                <option value="perday">Per Day</option>
                <option value="perweek">Per Week</option>
              </select>
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="startDate"
                className="text-[10px]"
              >
                Start Date
                <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]   shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="taxifirm"
                className="text-[10px]"
              >
                Taxi Firm
                <span className="text-red-600">*</span>
              </label>
              <select
                id="taxifirm"
                name="taxifirm"
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                required
              >
                <option value="">Select Taxi Firm</option>
                {taxiFirms.map((firm) => (
                  <option key={firm._id} value={firm?.name}>
                    {firm?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* added  */}
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="taxifirm"
                className="text-[10px]"
              >
                Taxi Local Authourity
                <span className="text-red-600">*</span>
              </label>
              <select
                id="taxifirm"
                name="taxilocalauthority"
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                required
              >
                <option value="">Taxi Local Authority</option>
                {localAuth.map((firm) => (
                  <option key={firm._id} value={firm.name}>
                    {firm.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="vehicle"

                className="text-[10px]"
              >
                Vehicles
                <span className="text-red-600">*</span>
              </label>

              <select
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px]"
                required
              >
                <option value="">Select Vehicle</option>

                {vehicle
                    .filter((v)=>v.isActive && v.vehicleStatus === "Standby")
                  .map((v) => (
                    <option key={v._id} value={v.model}>
                      {v.model}
                    </option>
                  ))}
              </select>

            </div>

            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="payment"
                className="text-[10px]"
              >
                Rent Payment Amount
                <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="payment"
                name="payment"
                min={1}
                value={formData.payment}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
            {/* <button
              type="submit"
              className="px-6 py-2 bg-custom-bg text-white rounded-[4px] text-xs font-bold hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button> */}
            <button
              type="submit"
              className={`px-6 py-2 bg-custom-bg text-white rounded-[4px] text-xs font-bold hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 ${loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              Save
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverMoreInfoModal;