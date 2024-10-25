"use client";
import {
  API_URL_Driver,
  //   API_URL_DriverMoreupdate,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
import {
  fetchTaxiFirms,
  fetchLocalAuth,
  fetchVehicle,
} from "../../../Components/DropdownData/taxiFirm/taxiFirmService";

const AddDriverMoreInfoModal = ({
  isOpen,
  onClose,
  //   fetchData,
  selectedUserId,
}) => {
  const [formData, setFormData] = useState({
    driverId: "",
    driverName: "",
    taxibadgedate: "",
    startDate: "",
    taxifirm: "",
    taxilocalauthority: "",
    vehicle: "",
    paymentcycle: "",
    payment: "",
    endDate: "",
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  const [loading, setLoading] = useState(false);
  const [taxiFirms, setTaxiFirms] = useState([]);
  const [localAuth, setLocalAuth] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [superadmin, setSuperadmin] = useState(null);

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
    const fetchdrivermoreinfoData = async () => {
      setLoading(true);
      if (selectedUserId) {
        console.log(selectedUserId);
        try {
          const response = await axios.get(
            `${API_URL_Driver}/${selectedUserId}`
          );
          //   console.log("get data: ", response.data);
          const data = response.data.result;
          if (data) {
            setFormData({
              driverId: data._id,
              driverName: `${data.firstName} ${data.lastName}`,
              adminCreatedBy: "",
              adminCompanyName: formData.adminCompanyName,
            });
          } else {
            console.log("Failed to fetch Driver data");
          }
        } catch (err) {
          console.log(
            err.response?.data?.message || "Failed to fetch manufacturer data"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchdrivermoreinfoData();
  }, [selectedUserId]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [taxiFirmsData, localAuthData, vehicle] = await Promise.all([
          fetchTaxiFirms(),
          fetchLocalAuth(),
          fetchVehicle(),
        ]);

        const storedCompanyName = localStorage.getItem("companyName");
        const filteredTaxiFirms =
          superadmin === "superadmin"
            ? taxiFirmsData.result
            : taxiFirmsData.result.filter(
                (firm) =>
                  firm.adminCompanyName === storedCompanyName ||
                  firm.adminCompanyName === "superadmin"
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
        setLocalAuth(filteredLocalAuth);
        setVehicle(filteredVehicle);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    loadDropdownData();
  }, [superadmin, formData.adminCompanyName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    // console.log(formData);
    // try {
    //   // update once again
    //   const formDataToSend = new FormData();
    //   const specificFieldKeytotalamount = "totalamount";
    //   const specificFieldKeytotalsubtractamount = "totalsubtractamount";
    //   const specificFieldKeystarttotalremainingamount = "totalremainingamount";
    //   const specificFieldKeyendDate = "endDate";
    //   const specificFieldKeystarttotalremaining = "remaining";

    //   formDataToSend.set(specificFieldKeytotalamount, formData.remaining);
    //   formDataToSend.set(
    //     specificFieldKeytotalsubtractamount,
    //     formData.subtractcalculation
    //   );
    //   formDataToSend.set(
    //     specificFieldKeystarttotalremainingamount,
    //     formData.remaining
    //   );
    //   formDataToSend.set(specificFieldKeyendDate, formData.endDate);
    //   formDataToSend.set(
    //     specificFieldKeystarttotalremaining,
    //     formData.remaining
    //   );
    //   if (formData) {
    //     Object.keys(formData).forEach((key) => {
    //       if (
    //         key !== specificFieldKeytotalamount &&
    //         key !== specificFieldKeytotalsubtractamount &&
    //         key !== specificFieldKeystarttotalremainingamount &&
    //         key !== specificFieldKeyendDate &&
    //         key !== specificFieldKeystarttotalremaining
    //       ) {
    //         formDataToSend.append(key, formData[key]);
    //       }
    //     });
    //   }
    //   const res = await axios.put(
    //     `${API_URL_DriverMoreupdate}/${selectedUserId}`,
    //     formDataToSend,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    //   setSuccess(true);
    //   fetchData();
    //   onClose();
    //   console.log("driver more info:", res.data);
    //   // End update
    // } catch (err) {
    //   console.log(err);
    //   setError(err.response?.data?.message || "Failed to add driver info");
    // } finally {
    //   setLoading(false);
    // }
  };

  if (!isOpen) return null;

  // Function to format the date
  //   const formatDate = (date) => {
  //     if (!date) return "";
  //     const d = new Date(date);
  //     if (isNaN(d.getTime())) return "";
  //     return d.toISOString().split("T")[0];
  //   };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Add Car Allotment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap -mx-2">
            {/* First row with three columns */}
            <div className="w-full md:w-1/3 px-2 mb-4 hidden">
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
                readOnly
              />
            </div>

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
                htmlFor="rentPaymentCycle"
                className="text-sm font-medium text-gray-700"
              >
                Rent Payment Cycle:
              </label>
              <select
                id="rentPaymentCycle"
                name="rentPaymentCycle"
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

            {/* Second row with three columns */}
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

            {/* Fourth row with three columns */}
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="LocalAuth"
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
                onChange={(e) => {
                  const selectedModel = e.target.value;
                  const selectedVehicle = filteredVehicles.find(
                    (vehicle) => vehicle.model === selectedModel
                  );
                  handleChange(e);
                  if (selectedVehicle) {
                    setselectedvehicle(selectedVehicle._id);
                  }
                }}
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
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label
                htmlFor="payment"
                className="text-sm font-medium text-gray-700"
              >
                Driver Payment:
              </label>
              <input
                type="number"
                id="payment"
                name="payment"
                value={formData.payment}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="In £"
                readOnly
              />
            </div>
          </div>

          {/* Action buttons */}
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
        </form>
      </div>
    </div>
  );
};

export default AddDriverMoreInfoModal;
