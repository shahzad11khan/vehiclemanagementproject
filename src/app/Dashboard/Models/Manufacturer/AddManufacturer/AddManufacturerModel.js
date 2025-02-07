"use client";
import { API_URL_Manufacturer } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useEffect, useState } from "react";
// import { fetchCarModel } from "../../../Components/DropdownData/taxiFirm/taxiFirmService";
import { toast } from "react-toastify";
import {
  getCompanyName,
  getsuperadmincompanyname,
  // getUserRole,
} from "@/utils/storageUtils";

const AddManufacturerModel = ({ isOpen, onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    name: "",
    carmodel: "",
    description: "",
    isActive: false,
    adminCreatedBy: "",
    adminCompanyName: "",
  });

  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState([]);

  useEffect(() => {
    const storedCompanyName = getCompanyName() || getsuperadmincompanyname();
    if (storedCompanyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: storedCompanyName,
      }));
    }
    // fetchDataa();
  }, []);

  // const fetchDataa = async () => {
  //   try {
  //     const stored = getCompanyName() || getsuperadmincompanyname();
  //     const role = getUserRole();
  //     // const title = await fetchCarModel();
  //     // console.log(title);
  //     // const filteredTaxiFirms =
  //       // role === "superadmin"
  //         // ? title.result
  //         // : title.result.filter(
  //             // (firm) =>
  //               // firm.adminCompanyName === stored ||
  //               // firm.adminCompanyName === "superadmin"
  //           // );

  //     // setData(filteredTaxiFirms);
  //   } catch (error) {
  //     console.error("Error fetching local auth data:", error);
  //   }
  // };

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
      const response = await axios.post(`${API_URL_Manufacturer}`, formData);
      setFormData({
        name: "",
        description: "",
        carmodel: "",
        isActive: false,
        adminCreatedBy: "",
        adminCompanyName: formData.adminCompanyName,
      });

      if (response.data.success) {
        toast.success("data successfully saved");
        fetchData();
        onClose();
      } else {
        toast.warn(response.data.error);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add badge");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-[50px] w-[528px] rounded-xl shadow-lg h-[428px]">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Add Manufacturer
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();

          }} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-[428px]">
            <div className="flex gap-1 items-center justify-start">
              <label
                htmlFor="firstName"
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
              className="mt-1 block w-full p-1 border border-[#42506666] rounded-[4px] shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  className="accent-red-700"
                />
                <span className="text-xs">InActive</span>
              </label>
            </div>
          </div>

          <div className="flex gap-[10px] justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-1 ml-2 text-custom-bg rounded-[4px] text-xs font-bold border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-custom-bg text-white text-xs font-bold rounded-[4px] hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
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

export default AddManufacturerModel;
