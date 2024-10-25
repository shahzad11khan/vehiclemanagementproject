"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { FaEdit, FaTrash } from "react-icons/fa";
import AddDriverAndVehicleModel from "../AddDriverAndVehicleModel/AddDriverAndVehicleModel";
// import UpdateBadgemodel from "../UpdateBadge/UpdateBadgeModel";
// import axios from "axios";
// import { API_URL_Badge } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
// import { GetBadge } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
// import { getCompanyName } from "@/utils/storageUtils";

const Page = ({ params }) => {
  const id = params.DriverVehicleID;
  console.log(id);
  //   const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //   const [filteredData, setFilteredData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenBadge, setIsOpenBadge] = useState(false);
  //   const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  //   const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // const companyNameFromStorage = getCompanyName();
    // if (companyNameFromStorage) {
    //   setSelectedCompanyName(companyNameFromStorage);
    // }
  }, []);

  //   const fetchData = async () => {
  //     try {
  //       GetBadge().then(({ result }) => {
  //         console.log(result);
  //         setData(result);
  //         setFilteredData(result);
  //       });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setData([]);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchData();
  //   }, []);

  //   const handleDelete = async (id) => {
  //     console.log("Deleting ID:", id);
  //     try {
  //       const response = await axios.delete(`${API_URL_Badge}/${id}`);
  //       const { data } = response;
  //       console.log("Response Data:", data);
  //       if (data.status === 200) {
  //         setData((prevData) => prevData.filter((item) => item._id !== id));
  //         setFilteredData((prevFilteredData) =>
  //           prevFilteredData.filter((item) => item._id !== id)
  //         );
  //         toast.success(data.message || "Badge deleted successfully.");
  //       } else {
  //         toast.warn(data.message || "Failed to delete the Badge.");
  //       }
  //     } catch (error) {
  //       console.error("Error deleting Badge:", error);
  //       toast.error(
  //         error.response?.data?.message ||
  //           "An error occurred while deleting the Badge. Please try again."
  //       );
  //     }
  //   };

  //   useEffect(() => {
  //     const filtered = data.filter((item) => {
  //       const companyMatch =
  //         item.adminCompanyName &&
  //         selectedCompanyName &&
  //         item.adminCompanyName.toLowerCase() ===
  //           selectedCompanyName.toLowerCase();
  //       const usernameMatch =
  //         item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());
  //       return companyMatch && usernameMatch;
  //     });
  //     setFilteredData(filtered);
  //   }, [searchTerm, data, selectedCompanyName]);

  const OpenBadgeModle = () => {
    setSelectedUserId(id);
    setIsOpenBadge(!isOpenBadge);
  };

  //   const handleEdit = (id) => {
  //     setSelectedUserId(id);
  //     setIsOpenVehcleUpdate(true);
  //   };

  //   const OpenVehicleUpdateModle = () => {
  //     setIsOpenVehcleUpdate(!isOpenVehicleUpdate);
  //   };
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 ">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between">
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenBadgeModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Car Allotment
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Badge
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Badge Description
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Badge Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody> */}
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddDriverAndVehicleModel
        isOpen={isOpenBadge}
        onClose={OpenBadgeModle}
        fetchData={fetchData}
        updateid={selectedUserId}
      />
      {/* <UpdateBadgemodel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        updateid={selectedUserId}
      /> */}
    </>
  );
};

export default Page;
