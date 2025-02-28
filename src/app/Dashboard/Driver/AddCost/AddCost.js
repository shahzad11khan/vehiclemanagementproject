"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import {API_URL_Driver} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
  import { toast } from "react-toastify";

import {
  getCompanyName,
  getUserId ,
  getUserName,getflag,getcompanyId,
} from "@/utils/storageUtils";

const AddCost = ({ isOpen, onClose,Id }) => {
  // console.log("cost id",Id);
  const [formData, setFormData] = useState({
    firstName: "",
    cost: "",
    date:"",
    description: "",
    // isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
    companyId:null,

  });

  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState([]);

  const fetchDt = async () => {
    try {
      // Fetch the driver information from the API
      const response = await axios.get(`${API_URL_Driver}/${Id}`);
      const { data } = response;

      console.log("Fetched records Add Cost", data.result);
      setFormData(data.result);
     
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };
  useEffect(() => {
    console.log("cost id",Id);
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
      if (storedcompanyName.toLowerCase() === "superadmin" && flag === "true") {
        setFormData((prevData) => ({
          ...prevData,
          adminCompanyName: storedcompanyName,
          companyId: compID,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          adminCompanyName: storedcompanyName,
          companyId: userId,
        }));
      }
    }
    fetchDt();
  }, [Id]);


  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: type === "checkbox" ? checked : value,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

  
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
              id="firstName"
              name="firstName"
              value={formData.firstName}
              // onChange={handleChange}
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
              // value={formData.cost}
              // onChange={handleChange}
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
              id="date"
              name="date"
              // value={formData.date}
              // onChange={handleChange}
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
              id="description"
              name="description"
              // value={formData.description}
              // onChange={handleChange}
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