"use client";
import { API_URL_CarModel } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCompanyName,
  getUserId ,getflag,getcompanyId,getsuperadmincompanyname
} from "@/utils/storageUtils";import { GetManufacturer } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";

const UpdateCarModel = ({ isOpen, onClose, fetchData, updateid }) => {
  const [formData, setFormData] = useState({
    name: "",
    makemodel: "",
    description: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
    companyId:null,

  });

  const [loading, setLoading] = useState(false);
  const [Manufacturer, setManufacturer] = useState([])
  const fetchDt = async () => {
    try {
      const storedCompanyName = getCompanyName()?.toLowerCase() || getsuperadmincompanyname()?.toLowerCase();
      const { result } = await GetManufacturer(); // Assuming this returns an array or object

      if (!result || !Array.isArray(result)) {
        throw new Error("Invalid data format from GetManufacturer");
      }

      const filterData = result.filter((item) =>
        item.adminCompanyName?.toLowerCase() === "superadmin" ||
        item.adminCompanyName?.toLowerCase() === storedCompanyName
      );

      setManufacturer(filterData); // Assuming setManufacturer expects an array
    } catch (error) {
      console.error("Error fetching data:", error);
      setManufacturer([]);
    }
  };

  useEffect(() => {
    const storedcompanyName = getCompanyName() || getsuperadmincompanyname();
    const userId = getUserId();
    const flag = getflag();
    const compID = getcompanyId();
  
    if (storedcompanyName && userId) {
      // Check if the company is "superadmin" and the flag is "true"
      if (storedcompanyName.toLowerCase() === "superadmin" && flag === "true") {
        setFormData((prevData) => ({
          ...prevData,
          adminCompanyName: storedcompanyName,
          companyId: compID, // Use compID in this case
        }));
      } else {
        // For other conditions, use the regular logic
        setFormData((prevData) => ({
          ...prevData,
          adminCompanyName: storedcompanyName,
          companyId: userId, // Use userId in this case
        }));
      }
    }
  
    // Always call fetchDt after the conditions
    fetchDt();
  }, []);
  

  useEffect(() => {
    const fetchManufacturerData = async () => {
      if (updateid) {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL_CarModel}/${updateid}`);
          const data = response.data.result;
          if (data) {
            setFormData({
              name: data.name,
              makemodel: data.makemodel,
              description: data.description,
              isActive: data.isActive,
              adminCreatedBy: data.adminCreatedBy,
              adminCompanyName: data.adminCompanyName,
              companyId: data.companyId
            });
          } else {
            toast.warn("Failed to fetch CarModel data");
          }
        } catch (err) {
          console.log(
            err.response?.data?.message || "Failed to fetch CarModel data"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchManufacturerData();
  }, [updateid]);

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
    try {
      const response = await axios.put(
        `${API_URL_CarModel}/${updateid}`,
        formData
      );

      if (response.data?.message) {
        // Reset form data after successful update
        setFormData({
          name: "",
          makemodel: "",
          description: "",
          isActive: false,
          adminCreatedBy: "",
          adminCompanyName: response.data.adminCompanyName || "", // Ensure this is defined
        });

        toast.success(response.data.message);
        onClose();
        fetchData();
      } else if (response.data?.warn) {
        toast.warn(response.data.warn);
      } else {
        // Handle unexpected response
        toast.error("Unexpected response from the server.");
      }
    } catch (err) {
      console.error("Error updating car model:", err);
      toast.error(err.response?.data?.message || "Failed to update car model");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-[50px] w-[528px] rounded-xl shadow-lg h-[428px]">
        {/* <h2 className="text-3xl font-semibold text-center mb-8">
          Update Car Model
        </h2> */}

        {/* <h2 className="text-2xl font-bold mb-8">
          Update Car Model
        </h2> */}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
          Update Car Model
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
          }} />

        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6"> */}
          <div className="flex  gap-2">
            <div className="col-span-2 flex-1">
              <div className="flex gap-1">
                <label
                  htmlFor="firstName"
                  className="text-[10px]"
                >
                  Model <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2  flex-1">
              <div className="flex gap-1">
                <label
                  htmlFor="makemodel"
                  className="text-[10px]"
                >
                  Manufacturer <span className="text-red-600">*</span>
                </label>
              </div>

              <select
                id="makemodel"
                name="makemodel"
                value={formData.makemodel}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>
                  Select a make
                </option>
                {Manufacturer.length > 0 ? (
                  Manufacturer.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No make available
                  </option>
                )}
              </select>
            </div>
          </div>
          {/* <div className="col-span-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Model:
              </label>
              <input
                type="text"
                id="makemodel"
                name="makemodel"
                value={formData.makemodel}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div> */}
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
              className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            ></textarea>
          </div>
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
          {/* </div> */}
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

export default UpdateCarModel;
