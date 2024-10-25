// "use client";

// import React, { useState, useEffect } from "react";
// import Header from "../../Components/Header";
// import Sidebar from "../../Components/Sidebar";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import AddVehicleModel from "../AddVehicle/AddVehicleModel";
// import UpdateVehicleModel from "../UpdateVehicleModel/UpdateVehicleModel";
// import axios from "axios";
// import { API_URL_Vehicle } from "../../Components/ApiUrl/ApiUrls";
// import { getCompanyName } from "@/utils/storageUtils";

// const Page = () => {
//   const [vehicle, setVehicle] = useState([]); // For storing fetched data
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMounted, setIsMounted] = useState(false);
//   const [isOpenVehicle, setIsOpenVehicle] = useState(false);
//   const [selectedCompanyName, setSelectedCompanyName] = useState("");
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//     const companyNameFromStorage = getCompanyName();
//     if (companyNameFromStorage) {
//       setSelectedCompanyName(companyNameFromStorage);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${API_URL_Vehicle}`);
//       setVehicle(response.data.result);
//       setFilteredData(response.data.result);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`${API_URL_Vehicle}/${id}`);
//       const { data } = response;

//       if (data.success) {
//         setVehicle((prevData) => prevData.filter((item) => item._id !== id));
//         setFilteredData((prevFilteredData) =>
//           prevFilteredData.filter((item) => item._id !== id)
//         );
//         toast.success(data.message);
//       } else {
//         toast.warn(data.message || "Failed to delete the vehicle.");
//       }
//     } catch (error) {
//       console.error("Error deleting vehicle:", error);
//       toast.error(
//         "An error occurred while deleting the vehicle. Please try again."
//       );
//     }
//   };

//   useEffect(() => {
//     const filtered = vehicle.filter((item) => {
//       const companyMatch =
//         item.adminCompanyName &&
//         selectedCompanyName &&
//         item.adminCompanyName.toLowerCase() ===
//           selectedCompanyName.toLowerCase();

//       const usernameMatch =
//         item &&
//         item.manufacturer &&
//         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

//       return companyMatch && usernameMatch;
//     });
//     setFilteredData(filtered);
//   }, [searchTerm, vehicle, selectedCompanyName]);

//   const handleEdit = (id) => {
//     setSelectedUserId(id);
//     setIsOpenVehcleUpdate(true);
//   };

//   if (!isMounted) {
//     return null;
//   }

//   const OpenVehicleModle = () => {
//     setIsOpenVehicle(!isOpenVehicle);
//   };

//   const OpenVehicleUpdateModle = () => {
//     setIsOpenVehcleUpdate(!isOpenVehicleUpdate);
//   };

//   return (
//     <>
//       <Header className="min-w-full" />
//       <div className="flex gap-4">
//         <Sidebar />
//         <div className="container mx-auto p-4">
//           <div className="mx-auto items-center border-2 mt-3 w-full">
//             <div className="flex justify-between">
//               <div className="justify-start">
//                 <input
//                   type="text"
//                   placeholder="Search by model"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="border rounded px-4 py-2 w-64"
//                 />
//               </div>
//               <div className="justify-end">
//                 <button
//                   onClick={OpenVehicleModle}
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   Add Vehicle
//                 </button>
//               </div>
//             </div>

//             {/* Responsive Tailwind CSS Table */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full border-collapse border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="border border-gray-300 px-4 py-2">
//                       Manufacturer
//                     </th>
//                     <th className="border border-gray-300 px-4 py-2">Model</th>
//                     <th className="border border-gray-300 px-4 py-2">Year</th>
//                     <th className="border border-gray-300 px-4 py-2">Type</th>
//                     <th className="border border-gray-300 px-4 py-2">
//                       Engine Type
//                     </th>
//                     <th className="border border-gray-300 px-4 py-2">
//                       Company
//                     </th>
//                     <th className="border border-gray-300 px-4 py-2">Active</th>
//                     <th className="border border-gray-300 px-4 py-2">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.map((row) => (
//                     <tr key={row._id} className="hover:bg-gray-100">
//                       <td className="border border-gray-300 px-4 py-2">
//                         {row.manufacturer}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         {row.model}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         {row.year}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         {row.type}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         {row.engineType}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         {row.adminCompanyName}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         {row.isActive ? "Yes" : "No"}
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleEdit(row._id)}
//                             className="text-blue-500 hover:text-blue-700"
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(row._id)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//       <AddVehicleModel
//         isOpen={isOpenVehicle}
//         onClose={OpenVehicleModle}
//         fetchData={fetchData}
//       />
//       <UpdateVehicleModel
//         isOpen={isOpenVehicleUpdate}
//         onClose={OpenVehicleUpdateModle}
//         fetchData={fetchData}
//         vehicleId={selectedUserId}
//       />
//     </>
//   );
// };

// export default Page;

"use client";

import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddVehicleModel from "../AddVehicle/AddVehicleModel";
import UpdateVehicleModel from "../UpdateVehicleModel/UpdateVehicleModel";
import axios from "axios";
import { API_URL_Vehicle } from "../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const [vehicle, setVehicle] = useState([]); // For storing fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenVehicle, setIsOpenVehicle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehcleUpdate] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL_Vehicle}`);
      setVehicle(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Vehicle}/${id}`);
      const { data } = response;

      if (data.success) {
        setVehicle((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message);
      } else {
        toast.warn(data.message || "Failed to delete the vehicle.");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error(
        "An error occurred while deleting the vehicle. Please try again."
      );
    }
  };

  useEffect(() => {
    const filtered = vehicle.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        selectedCompanyName &&
        item.adminCompanyName.toLowerCase() ===
          selectedCompanyName.toLowerCase();

      const usernameMatch =
        item &&
        item.manufacturer &&
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, vehicle, selectedCompanyName]);

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenVehcleUpdate(true);
  };

  if (!isMounted) {
    return null;
  }

  const OpenVehicleModle = () => {
    setIsOpenVehicle(!isOpenVehicle);
  };

  const OpenVehicleUpdateModle = () => {
    setIsOpenVehcleUpdate(!isOpenVehicleUpdate);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between">
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by model"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <div className="justify-end">
                <button
                  onClick={OpenVehicleModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Vehicle
                </button>
              </div>
            </div>

            {/* Responsive Tailwind CSS Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">
                      Manufacturer
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Model</th>
                    <th className="border border-gray-300 px-4 py-2">Year</th>
                    <th className="border border-gray-300 px-4 py-2">Type</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Engine Type
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Company
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Active</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">
                        {row.manufacturer}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.model}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.year}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.type}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.engineType}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.adminCompanyName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {row.isActive ? "Yes" : "No"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(row._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center text-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage
                    ? "bg-blue-300 text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddVehicleModel
        isOpen={isOpenVehicle}
        onClose={OpenVehicleModle}
        fetchData={fetchData}
      />
      <UpdateVehicleModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        vehicleId={selectedUserId}
      />
    </>
  );
};

export default Page;
