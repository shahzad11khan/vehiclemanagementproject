"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddMotModal from "../AddMOTModal/AddMotModal";
import { API_URL_VehicleMOT } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName, getUserName } from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const router = useRouter();
  const addAddMOTReporttId = params.AddMOTReport;
  // console.log("from home page : ", addAddMOTReporttId);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenTitle, setIsOpenTitle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedid, setselectedid] = useState(null);
  const recordsPerPage = 10;
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [router]);
  useEffect(() => {
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL_VehicleMOT}/${addAddMOTReporttId}`
      );
      console.log("MOT Data: ", response.data.result);
      setData(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_VehicleMOT}/${id}`);
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
    const companyName = getCompanyName();
    const username = getUserName();

    const filtered = data.filter((item) => {
      // Check if the company name matches (case-insensitive)
      if (item.adminCompanyName.toLowerCase() === companyName.toLowerCase()) {
        return true;
      }
      // Check if the username matches and the company name matches
      return (
        username === item.asignto &&
        item.adminCompanyName.toLowerCase() === companyName.toLowerCase()
      );
    });
    
    setFilteredData(filtered);
    setCurrentPage(1);
    
  }, [data]);

  const toggleTitleModal = () => {
    setIsOpenTitle((prev) => !prev);
    setselectedid(addAddMOTReporttId);
  };

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentRecords = filteredData.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set title and report date
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("MOT Records Report", 105, 10, { align: "center" });

    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${reportDate}`, 14, 20);

    // Display vehicle details
    const vehicleName = filteredData[0].VehicleName || "Name Unavailable";
    const vehicleRegistration =
        filteredData[0].registrationNumber || "Registration Unavailable";
    doc.text(`Vehicle Name: ${vehicleName}`, 14, 30);
    doc.text(`Registration Number: ${vehicleRegistration}`, 14, 35);
    doc.text(`Company Name: ${selectedCompanyName}`, 14, 40);

    // Define table columns and widths
    const tableColumn = [
        "MOT Dates",
        "MOT Cycle",
        "Next MOT Date",
        "MOT Status",
        "MOT Assign",
    ];
    const columnWidths = [30, 30, 30, 30, 60]; // Last column is double width

    let startX = 14;
    let startY = 50;
    const lineHeight = 8;
    const pageHeight = doc.internal.pageSize.height;

    // Add table header
    doc.setFont("helvetica", "bold");
    tableColumn.forEach((column, index) => {
        doc.text(
            column,
            startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2,
            startY + lineHeight / 2,
            { align: "left" }
        );
        doc.rect(
            startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
            startY,
            columnWidths[index],
            lineHeight
        );
    });

    // Add table rows
    let currentY = startY + lineHeight;
    doc.setFont("helvetica", "normal");
    filteredData.forEach((row) => {
        if (currentY + lineHeight > pageHeight - 20) {
            doc.addPage();
            currentY = 20;

            // Re-add the header on the new page
            doc.setFont("helvetica", "bold");
            tableColumn.forEach((column, index) => {
                doc.text(
                    column,
                    startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2,
                    currentY + lineHeight / 2,
                    { align: "left" }
                );
                doc.rect(
                    startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
                    currentY,
                    columnWidths[index],
                    lineHeight
                );
            });
            currentY += lineHeight;
        }

        // Add data cells
        const data = [
            new Date(row.motCurrentDate).toLocaleDateString() || "N/A",
            row.motCycle || "N/A",
            new Date(row.motDueDate).toLocaleDateString() || "N/A",
            row.motStatus || "N/A",
            row.asignto || "N/A",
        ];

        data.forEach((cell, index) => {
            doc.text(
                cell,
                startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2,
                currentY + lineHeight / 2,
                { align: "left" }
            );
            doc.rect(
                startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
                currentY,
                columnWidths[index],
                lineHeight
            );
        });

        currentY += lineHeight;
    });

    // Save the PDF
    doc.save("MOT_Records_Report.pdf");
};


  return (
    <>
      <Header />
      <div className="flex w-full">
        <Sidebar className="w-4/12" />
        <div className="mx-auto w-10/12 p-4 h-screen">
          <div className="border-2 mt-3 w-full ">
            <div className="flex justify-between">
              <div className="flex gap-2 m-2">
                <button
                  onClick={generatePDF}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Generate Report
                </button>
                <button
                  onClick={toggleTitleModal}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Add MOT
                </button>
              </div>
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
                      MOT Dates
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      MOT Cycle
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Next MOT Date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      MOT Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      MOT Assign
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
                        {(() => {
                          const date = new Date(row.motCurrentDate);
                          const formattedDate = `${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}/${String(date.getDate()).padStart(
                            2,
                            "0"
                          )}/${date.getFullYear()}`;
                          return formattedDate;
                        })() || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.motCycle || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {(() => {
                          const date = new Date(row.motDueDate);
                          const formattedDate = `${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}/${String(date.getDate()).padStart(
                            2,
                            "0"
                          )}/${date.getFullYear()}`;
                          return formattedDate;
                        })() || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.motStatus || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.VehicleStatus  ? "True" :"False"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.asignto || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <button
                          onClick={() => handleDelete(row._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <img src="/trash.png" alt="delete" className="w-6" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center text-center mt-4 mb-2">
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
      <AddMotModal
        isOpen={isOpenTitle}
        onClose={() => setIsOpenTitle(false)}
        selectedid={selectedid}
        fetchData={fetchData}
      />
    </>
  );
};

export default Page;
