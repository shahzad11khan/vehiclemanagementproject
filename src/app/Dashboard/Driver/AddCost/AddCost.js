"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {API_URL_Driver,API_URL_DriverMoreInfo,API_URL_Driver_Vehicle_Allotment} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
  // import { toast } from "react-toastify";

import {
  getCompanyName,
  getUserId ,
  getUserName,getflag,getcompanyId,
} from "@/utils/storageUtils";

const AddCost = ({ isOpen, onClose,fetchData,Id }) => {
  // console.log("cost id",Id);
  const [formData, setFormData] = useState({
    driverId: "",
    driverName: "",
    vehicle:"",
    vehicleId:"",
    startDate: null,
    cost:null,
    pay:0,
    discription:"",
  });

  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!Id) return; // Prevent API call if Id is empty or undefined
  
      try {
        const { data } = await axios.get(`${API_URL_Driver}/${Id}`);
        const response = await axios.get(`${API_URL_Driver_Vehicle_Allotment}/${Id}`
        );
        console.log("Fetched Data:", data);
        console.log("Fetched vehicle:", response.data.result);
  
        setFormData((prevData) => ({
          ...prevData,
          driverId: data.result._id,
          driverName: `${data.result.firstName} ${data.result.lastName}`,
          vehicle: response.data.result[0].vehicle,
          vehicleId:response.data.result[0].vehicleId
        }));
      } catch (err) {
        console.error(err.response?.data?.message || "Failed to fetch driver data");
      }
    };
  
    fetchDriverData(); // Call API function
  }, [Id]); // Re-run only when Id changes
  
  useEffect(() => {
    // console.log("cost id",Id);
    const storedcompanyName = (() => {
      const name1 = getCompanyName();
      if (name1) return name1;
    
      const name2 = getUserName();
      if (name2) return name2;
  
    })();
    const userId = getUserId();
    const flag = getflag();
    const compID = getcompanyId();
  
    console.log(storedcompanyName, userId, flag, compID);
  
    if (storedcompanyName && userId) {
        setFormData((prevData) => ({
          ...prevData,
          adminCompanyName: storedcompanyName,
          companyId: userId,
        }));
      }
 
  }, []);


  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value, // Convert to number if input type is 'number'
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("formData:", formData);
  
    if (!Id) {
      console.error("Error: Missing ID");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.put(`${API_URL_DriverMoreInfo}/${Id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      });
  
      if (response.status === 200) {
        console.log("Fetched records:", response.data);
        fetchData();
      } else {
        console.error("Failed to update record:", response.data);
      }
    } catch (error) {
      console.error("Error updating record:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-[50px] w-[528px] rounded-xl shadow-lg h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Add cost
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();

          }} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="w-[428px]">
            <div className="flex gap-1 items-center justify-start">
              <label
                htmlFor="firstName"
                className="text-[10px]"
              >
                Driver Name <span className="text-red-600">*</span>
              </label>
            </div>
            <input
              type="text"
              id="driverName"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              className="mt-1 block w-full p-1 border border-[#42506666]  rounded shadow focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Driver Name"
              disabled
            />
          </div>
          <div className="w-[428px]">
            <div className="flex gap-1 items-center justify-start">
              <label
                htmlFor="firstName"
                className="text-[10px]"
              >
                Driver cost <span className="text-red-600">*</span>
              </label>
            </div>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="mt-1 block w-full p-1 border border-[#42506666]  rounded shadow focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="w-[428px]">
            <div className="flex gap-1 items-center justify-start">
              <label
                htmlFor="firstName"
                className="text-[10px]"
              >
                Date <span className="text-red-600">*</span>
              </label>
            </div>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full p-1 border border-[#42506666]  rounded shadow focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="description"
              className="text-[10px]"
            >
              Description
            </label>
            <textarea
              id="discription"
              name="discription"
              value={formData.discription}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-[#42506666] rounded-[4px] shadow focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            ></textarea>
          </div>
          
         

          <div className="flex gap-[10px] justify-start">
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
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCost;