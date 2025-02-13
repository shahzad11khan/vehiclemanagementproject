"use client";
import { API_URL_Supplier } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCompanyName,
  getUserId ,
  getUserName,getflag,getcompanyId
} from "@/utils/storageUtils";

const UpdateSupplierModel = ({ isOpen, onClose, fetchData, supplierid }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
    companyId: null,

  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Retrieve company name from local storage
  useEffect(() => {
    const storedcompanyName = getUserName() || getCompanyName(); 
    const userId = getUserId(); 
    const flag = getflag();
    const compID = getcompanyId();
    if (storedcompanyName && userId) {
    if (storedcompanyName.toLowerCase() === "superadmin" && flag === "true") {
      setFormData((prevData) => ({
          ...prevData,
          adminCompanyName: storedcompanyName,
          companyId:  compID 
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedcompanyName,
        companyId: userId,
      }));
    }
  }, []);/// Update when the manufacturer changes
  // Fetch manufacturer data when the modal opens
  useEffect(() => {
    // console.log(vehicleid);
    // alert(supplierid);
    const fetchManufacturerData = async () => {
      setLoading(true);
      if (supplierid) {
        try {
          const response = await axios.get(`${API_URL_Supplier}/${supplierid}`);
          console.log(response.data.result);
          const data = response.data.result;
          if (data) {
            setFormData({
              name: data.name,
              description: data.description,
              isActive: data.isActive,
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

    fetchManufacturerData();
  }, [supplierid]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Use PUT for updating an existing manufacturer
      const response = await axios.put(
        `${API_URL_Supplier}/${supplierid}`,
        formData
      );
      console.log(response);
      setFormData({
        name: "",
        description: "",
        isActive: false,
        adminCreatedBy: "",
        adminCompanyName: "",
      });

      toast.success("Data successfully updated");
      setSuccess(true);
      onClose();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update manufacturer");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-xl">
        {/* <h2 className="text-3xl font-semibold text-center mb-8">
          Update Vehicle
        </h2> */}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Update Supplier
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
          }} />
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}
        {success && (
          <p className="text-xs text-green-700">Vehicle updated successfully!</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              {/* <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name:
              </label> */}
              <div className="flex gap-1">
                <label
                  htmlFor="name"
                  className="text-[10px]"
                >
                  Name <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="text-[10px]"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>

            {/* IsActive */}
            {/* <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                IsActive
              </label>
            </div> */}
            <div>
              {/* <label className="block font-medium mb-2">Is Active:</label> */}
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
          </div>

          {/* Button Group */}
          <div className="flex gap-[10px] justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSupplierModel;
