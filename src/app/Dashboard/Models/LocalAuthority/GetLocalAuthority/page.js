// "use client";

// import React, { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import Header from "../../../Components/Header";
// import Sidebar from "../../../Components/Sidebar";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaTrash } from "react-icons/fa";
// import AddLocalAuthorityModel from "../AddLocalAuthority/AddLocalAuthorityModel";
// import axios from "axios";
// import { API_URL_LocalAuthority } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
// import { GetLocalAuthority } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
// import { getCompanyName } from "@/utils/storageUtils";

// const Page = () => {
//   // State for the search term
//   const columns = [
//     {
//       name: "Authorities Name",
//       selector: (row) => row.name,
//       sortable: true,
//     },
//     {
//       name: "Description",
//       selector: (row) => row.description,
//       sortable: true,
//     },
//     {
//       name: "Company",
//       selector: (row) => row.adminCompanyName,
//       sortable: true,
//     },
//     {
//       name: "Authority Status",
//       selector: (row) => (row.isActive ? "Active" : "InActive"),
//       sortable: true,
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <div className="flex gap-2">
//           {/* <button
//             onClick={() => handleEdit(row._id)}
//             className="text-blue-500 hover:text-blue-700"
//           >
//             <FaEdit />
//           </button> */}
//           <button
//             onClick={() => handleDelete(row._id)}
//             className="text-red-500 hover:text-red-700"
//           >
//             <FaTrash />
//           </button>
//         </div>
//       ),
//       allowOverflow: true,
//       button: true,
//     },
//   ];

//   const [data, setData] = useState([]); // State to hold fetched data
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMounted, setIsMounted] = useState(false);
//   const [isOpenAuthority, setIsOpenAuthority] = useState(false);
//   const [selectedCompanyName, setSelectedCompanyName] = useState("");

//   // Ensure that the component only renders once it is mounted
//   useEffect(() => {
//     setIsMounted(true);
//     const companyNameFromStorage = getCompanyName(); // Get company name from localStorage
//     if (companyNameFromStorage) {
//       setSelectedCompanyName(companyNameFromStorage); // Set the selected company name
//     }
//   }, []);

//   // Filtering the data based on the search term
//   const fetchData = async () => {
//     try {
//       GetLocalAuthority().then(({ result }) => {
//         console.log(result);
//         setData(result); // Set the fetched data
//         setFilteredData(result);
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setData([]); // Reset data to an empty array on error
//     }
//   };
//   //
//   useEffect(() => {
//     fetchData();
//   }, []);
//   const handleDelete = async (id) => {
//     console.log("Deleting ID:", id); // Log the ID to be deleted
//     try {
//       const response = await axios.delete(`${API_URL_LocalAuthority}/${id}`);
//       const { data } = response; // Destructure data from response

//       console.log("Response Data:", data); // Log the response data

//       if (data.status === 200) {
//         // If the deletion was successful, update the state
//         setData((prevData) => prevData.filter((item) => item._id !== id));
//         setFilteredData((prevFilteredData) =>
//           prevFilteredData.filter((item) => item._id !== id)
//         );
//         toast.success(data.message || "Authority deleted successfully."); // Show success message
//       } else {
//         // If the success condition is not met
//         toast.warn(data.message || "Failed to delete the Authority."); // Show warning message
//       }
//     } catch (error) {
//       console.error("Error deleting Authority:", error); // Log the error

//       // Show a user-friendly error message
//       toast.error(
//         error.response?.data?.message ||
//           "An error occurred while deleting the Manufacturer. Please try again."
//       );
//     }
//   };

//   // Filter data based on search term and selected company
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
//     setFilteredData(filtered); // Update filtered data state
//   }, [searchTerm, data, selectedCompanyName]);

//   // const handleEdit = (id) => {
//   //   toast.info(`Edit item with ID: ${id}`);
//   //   // Implement your edit logic here
//   // };

//   if (!isMounted) {
//     return null; // Render nothing until the component is mounted
//   }

//   const OpenAuthorityModle = () => {
//     setIsOpenAuthority(!isOpenAuthority);
//   };

//   return (
//     <>
//       <Header className="min-w-full" />
//       <div className="flex gap-4">
//         <Sidebar />
//         <div className="container mx-auto p-4 ">
//           <div className="justify-between mx-auto items-center border-2 mt-3 w-[78%]">
//             <div className="flex justify-between">
//               {/* Search Input */}
//               <div className="justify-start">
//                 <input
//                   type="text"
//                   placeholder="Search by title"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="border rounded px-4 py-2 w-64" // Tailwind CSS classes for input
//                 />
//               </div>
//               {/* Add User Button */}
//               <div className="justify-end">
//                 <button
//                   onClick={OpenAuthorityModle}
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   Add New Auhority
//                 </button>
//               </div>
//             </div>

//             {/* Data Table */}
//             <DataTable
//               title="Auhorities List"
//               columns={columns}
//               data={filteredData} // Use filtered data
//               pagination
//             />
//           </div>
//         </div>
//       </div>
//       <AddLocalAuthorityModel
//         isOpen={isOpenAuthority}
//         onClose={OpenAuthorityModle}
//         fetchData={fetchData}
//       />
//     </>
//   );
// };

// export default Page;

"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import AddLocalAuthorityModel from "../AddLocalAuthority/AddLocalAuthorityModel";
import axios from "axios";
import { API_URL_LocalAuthority } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetLocalAuthority } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName } from "@/utils/storageUtils";

const Page = () => {
  const columns = [
    { name: "Authorities Name", selector: "name" },
    { name: "Description", selector: "description" },
    { name: "Company", selector: "adminCompanyName" },
    { name: "Authority Status", selector: "isActive" },
  ];

  const [data, setData] = useState([]); // State to hold fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenAuthority, setIsOpenAuthority] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName(); // Get company name from localStorage
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage); // Set the selected company name
    }
  }, []);

  const fetchData = async () => {
    try {
      GetLocalAuthority().then(({ result }) => {
        console.log(result);
        setData(result); // Set the fetched data
        setFilteredData(result);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Reset data to an empty array on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting ID:", id); // Log the ID to be deleted
    try {
      const response = await axios.delete(`${API_URL_LocalAuthority}/${id}`);
      const { data } = response; // Destructure data from response

      console.log("Response Data:", data); // Log the response data

      if (data.status === 200) {
        // If the deletion was successful, update the state
        setData((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        toast.success(data.message || "Authority deleted successfully."); // Show success message
      } else {
        // If the success condition is not met
        toast.warn(data.message || "Failed to delete the Authority."); // Show warning message
      }
    } catch (error) {
      console.error("Error deleting Authority:", error); // Log the error

      // Show a user-friendly error message
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the Manufacturer. Please try again."
      );
    }
  };

  useEffect(() => {
    const filtered = data.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        selectedCompanyName &&
        item.adminCompanyName.toLowerCase() ===
          selectedCompanyName.toLowerCase();

      const usernameMatch =
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());

      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered); // Update filtered data state
  }, [searchTerm, data, selectedCompanyName]);

  const OpenAuthorityModle = () => {
    setIsOpenAuthority(!isOpenAuthority);
  };

  if (!isMounted) {
    return null; // Render nothing until the component is mounted
  }

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4 ">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full p-4">
            <div className="flex justify-between mb-4">
              {/* Search Input */}
              <div className="justify-start">
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64" // Tailwind CSS classes for input
                />
              </div>
              {/* Add Authority Button */}
              <div className="justify-end">
                <button
                  onClick={OpenAuthorityModle}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New Authority
                </button>
              </div>
            </div>

            {/* Tailwind CSS Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.selector}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.name}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.adminCompanyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.isActive ? "Active" : "InActive"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(item._id)}
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
          </div>
        </div>
      </div>
      <AddLocalAuthorityModel
        isOpen={isOpenAuthority}
        onClose={OpenAuthorityModle}
        fetchData={fetchData}
      />
    </>
  );
};

export default Page;
