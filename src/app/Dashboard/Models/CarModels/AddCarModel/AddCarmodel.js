"use client";
import { API_URL_CarModel } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetManufacturer } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import {
  getCompanyName,
  getUserId ,
  getUserName,getflag,getcompanyId,getsuperadmincompanyname
} from "@/utils/storageUtils";
const AddCarModel = ({ isOpen, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    name: "",
    makemodel: "",
    description: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
    companyId:null,

  });

  const [Manufacturer, setManufacturer] = useState([])

  const [loading, setLoading] = useState(false);

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
    fetchDt();
  }, []);


  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === "checkbox" ? checked : value,
  //   });
  // };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL_CarModel}`, formData);
      if (response.data.success) {
        setFormData({
          name: "",
          makemodel: "",
          description: "",
          isActive: false,
          adminCreatedBy: "",
          adminCompanyName: formData.adminCompanyName,
        });
        toast.success(response.data.message);
        fetchData();
        onClose();
      } else {
        toast.warn(response.data.error);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to add CarModel");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-[50px] w-[528px] rounded-xl shadow-lg h-[428px]">
        {/* <h2 className="text-3xl font-semibold text-center mb-8">
          Add New Car Model
        </h2> */}

        {/* <h2 className="text-2xl font-bold mb-8">
          Add Model
        </h2> */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Add Model
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
          }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div className="grid grid-cols-2 sm:grid-cols-2 gap-6"> */}
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
                required placeholder="Corolla"
              />
            </div>

            <div className="col-span-2 flex-1">
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
                <option value="" disabled className="text-[8px]">
                  Select manufacturer
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
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarModel;