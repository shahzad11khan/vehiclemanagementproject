"use client";
import { API_URL_CarModel } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCompanyName, getsuperadmincompanyname } from "@/utils/storageUtils";
import { GetManufacturer } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";

const UpdateCarModel = ({ isOpen, onClose, fetchData, updateid }) => {
  const [formData, setFormData] = useState({
    name: "",
    makemodel:"",
    description: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
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
    const storedCompanyName = getCompanyName() || getsuperadmincompanyname();
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Update Car Model
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-2">
              <div className="flex gap-1">
                <label
                  htmlFor="makemodel"
                  className="text-sm font-medium text-gray-700"
                >
                  Make:
                </label>
                <span className="text-red-600">*</span>
              </div>

              <select
                id="makemodel"
                name="makemodel"
                value={formData.makemodel}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
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
            </div>
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="3"
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
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
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
