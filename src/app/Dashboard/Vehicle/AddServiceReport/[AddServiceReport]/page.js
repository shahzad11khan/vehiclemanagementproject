"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
// import AddMaintenanceModel from "../../AddMaintenanceModal/AddmaintenanceModel";
import { GetTitle } from "../../../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { API_URL_Title } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";

const Page = ({ params }) => {
  const addServiceId = params.AddServiceReport;
  console.log("ADD Service Id page id", addServiceId);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [isOpenTitle, setIsOpenTitle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedid, setselectedid] = useState(null);
  const recordsPerPage = 10;

  useEffect(() => {
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const { result } = await GetTitle();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Title}/${id}`);
      if (response.data.success) {
        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting title:", error);
      toast.error("Failed to delete title");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.adminCompanyName?.toLowerCase() ===
          selectedCompanyName.toLowerCase() &&
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, data, selectedCompanyName]);

  // const toggleTitleModal = () => {
  //   // console.log("model click");
  //   setIsOpenTitle((prev) => !prev);
  //   setselectedid(addmaintenancereportId);
  // };

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredData.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  return (
    <>
      <Header />
      <div className="flex w-full">
        <Sidebar className="w-4/12" />
        <div className="mx-auto w-10/12 p-4">
          <div className="border-2 mt-3 w-full ">
            <div className="flex justify-between">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-4 py-2 w-64"
              />
              <button
                // onClick={toggleTitleModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Service
              </button>
            </div>

            <div className="mt-4 overflow-x-auto w-full">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Registration Number
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Issues And Damages
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Organisation
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Repair Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Job Number
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Memo
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Part Number
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Part Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Part Price
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Part Supplier
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Labour Hours
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Cost
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Signed By
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Repair Date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Repair Images
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.VehicleName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.registrationNumber}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.issues}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.organisations} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.repairStatus} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.jobNumber} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.memo} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.parts.partNumber} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.parts.partName} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.parts.price} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.parts.supplier} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.labourHours} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.signedOffBy} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.date} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.images} */}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {/* {row.repairHistory.images} */}
                      </td>

                      <td className="py-2 px-4 border-b border-gray-200">
                        <button
                          onClick={() => handleDelete(row._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center text-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
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
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <AddMaintenanceModel
        isOpen={isOpenTitle}
        onClose={toggleTitleModal}
        fetchData={fetchData}
        selectedid={selectedid}
      /> */}
    </>
  );
};

export default Page;
