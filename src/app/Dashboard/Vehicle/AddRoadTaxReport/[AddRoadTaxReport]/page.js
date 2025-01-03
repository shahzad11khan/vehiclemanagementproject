"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddRoadTexModal from "../AddRoadTaxModal/AddRoadTaxModal";
import { API_URL_VehicleRoadTex } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName, getUserName } from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
const Page = ({ params }) => {
  const router = useRouter();
  const addRoadTaxReportId = params.AddRoadTaxReport;
  console.log("ADD Road Taxt page id", addRoadTaxReportId);
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
        `${API_URL_VehicleRoadTex}/${addRoadTaxReportId}`
      );
      console.log("Road Tex Data: ", response.data.result);
      setData(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_VehicleRoadTex}/${id}`);
      if (response.data.success) {
        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting:", error);
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
    setselectedid(addRoadTaxReportId);
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
    doc.setFontSize(14); // Large font for title
    doc.setFont("helvetica", "bold");
    doc.text("Road Tax Records Report", 105, 10, { align: "center" });
  
    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(10); // Smaller font for the report date
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${reportDate}`, 14, 20);
  
    // Display vehicle name once at the top
    const vehicleName = filteredData[0]?.VehicleName || "Name Unavailable";
    const vehicleRegistration =
      filteredData[0]?.registrationNumber || "Registration Unavailable";
    const companyName = selectedCompanyName || "Company Unavailable";
  
    doc.text(`Vehicle Name: ${vehicleName}`, 14, 25);
    doc.text(`Registration Number: ${vehicleRegistration}`, 14, 30);
    doc.text(`Company Name: ${companyName}`, 14, 35);
  
    // Define table columns and their initial X positions
    const tableColumn = [
      "Current Date",
      "Due Date",
      "Tax Cycle",
      "Assign To",
      "Tax Status",
    ];
  
    let startX = 14;
    let startY = 52; // Adjust to leave space after the vehicle name
    const columnWidth = 37; // Adjusted column width to better fit the page
    const lineHeight = 5; // Height of each row
    const padding = 2; // Padding inside cells
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page
  
    // Add table header (Make header bold)
    doc.setFont("helvetica", "bold"); // Set the font to bold for the header
    tableColumn.forEach((column, index) => {
      const textWidth = doc.getStringUnitWidth(column) * doc.getFontSize() / doc.internal.scaleFactor;
      const centeredX = startX + index * columnWidth + (columnWidth - textWidth) / 2;
      doc.text(column, centeredX, startY);
      doc.rect(startX + index * columnWidth, startY - lineHeight, columnWidth, lineHeight);
    });
  
    // Switch back to normal font for the rows
    doc.setFont("helvetica", "normal");
  
    // Add table rows
    let currentY = startY + lineHeight;
    filteredData.forEach((row) => {
      // Check if the next row fits within the current page
      if (currentY + lineHeight > pageHeight - 20) {
        doc.addPage(); // Add a new page if the row won't fit
        currentY = 20; // Reset Y to start at the top of the new page
        // Re-add the header on the new page
        doc.setFont("helvetica", "bold"); // Header bold on new page
        tableColumn.forEach((column, index) => {
          const textWidth = doc.getStringUnitWidth(column) * doc.getFontSize() / doc.internal.scaleFactor;
          const centeredX = startX + index * columnWidth + (columnWidth - textWidth) / 2;
          doc.text(column, centeredX, currentY);
          doc.rect(startX + index * columnWidth, currentY - lineHeight, columnWidth, lineHeight);
        });
        currentY += lineHeight; // Adjust the Y after the header
        doc.setFont("helvetica", "normal"); // Switch back to normal font for rows
      }
  
      // Format each data cell to handle potential multi-line content
      const roadtexCurrentDate = doc.splitTextToSize(
        (() => {
          if (!row.roadtexCurrentDate) return "N/A";
          const date = new Date(row.roadtexCurrentDate);
          const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        })(),
        columnWidth - padding
      );
      const roadtexDueDate = doc.splitTextToSize(
        (() => {
          if (!row.roadtexDueDate) return "N/A"; // If roadtexDueDate is null or undefined, return "N/A"
          const date = new Date(row.roadtexDueDate);
          const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        })(),
        columnWidth - padding
      );
      const roadtexCycle = doc.splitTextToSize(row.roadtexCycle || "N/A", columnWidth - padding);
      const asignto = doc.splitTextToSize(row.asignto || "N/A", columnWidth - padding);
      const roadtexStatus = doc.splitTextToSize(row.roadtexStatus || "N/A", columnWidth - padding);
  
      const maxCellHeight = Math.max(
        roadtexCurrentDate.length,
        roadtexDueDate.length,
        roadtexCycle.length,
        asignto.length,
        roadtexStatus.length
      ) * lineHeight;
  
      // Add the data cells with borders and center the text
      doc.text(roadtexCurrentDate, startX + padding, currentY + (maxCellHeight / 15));
      doc.rect(startX, currentY - lineHeight, columnWidth, maxCellHeight);
  
      doc.text(roadtexDueDate, startX + columnWidth + padding, currentY + (maxCellHeight / 15));
      doc.rect(startX + columnWidth, currentY - lineHeight, columnWidth, maxCellHeight);
  
      doc.text(roadtexCycle, startX + 2 * columnWidth + padding, currentY + (maxCellHeight / 15));
      doc.rect(startX + 2 * columnWidth, currentY - lineHeight, columnWidth, maxCellHeight);
  
      doc.text(asignto, startX + 3 * columnWidth + padding, currentY + (maxCellHeight / 15));
      doc.rect(startX + 3 * columnWidth, currentY - lineHeight, columnWidth, maxCellHeight);
  
      doc.text(roadtexStatus, startX + 4 * columnWidth + padding, currentY + (maxCellHeight / 15));
      doc.rect(startX + 4 * columnWidth, currentY - lineHeight, columnWidth, maxCellHeight);
  
      // Increment Y for the next row
      currentY += maxCellHeight;
    });


    //////// -----------------------------
  
    // Save the PDF
    doc.save("Road_Tax_Report.pdf");
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
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Road Text
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
                      Tax Dates
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Tax Cycle
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Tax Due Date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Tax Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Tax Assign
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
                          // Check if motDueDate is null
                          if (!row.roadtexCurrentDate) return " "; // If the date is null or falsy, return an empty space

                          const date = new Date(row.roadtexCurrentDate);

                          // Check if the date is invalid (NaN)
                          if (isNaN(date.getTime())) return " "; // If the date is invalid, return an empty space

                          // Format the valid date as MM/DD/YYYY
                          const formattedDate = `${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}/${String(date.getDate()).padStart(
                            2,
                            "0"
                          )}/${date.getFullYear()}`;
                          return formattedDate;
                        })()}
                      </td>

                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.roadtexCycle}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {(() => {
                          // Check if motDueDate is null
                          if (!row.roadtexDueDate) return " "; // If the date is null or falsy, return an empty space

                          const date = new Date(row.roadtexDueDate);

                          // Check if the date is invalid (NaN)
                          if (isNaN(date.getTime())) return " "; // If the date is invalid, return an empty space

                          // Format the valid date as MM/DD/YYYY
                          const formattedDate = `${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}/${String(date.getDate()).padStart(
                            2,
                            "0"
                          )}/${date.getFullYear()}`;
                          return formattedDate;
                        })()}
                      </td>

                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.roadtexStatus}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.VehicleStatus ? "True" : "False"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.asignto}
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
                className={`px-3 py-1 mx-1 rounded ${currentPage
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
      <AddRoadTexModal
        isOpen={isOpenTitle}
        onClose={toggleTitleModal}
        fetchData={fetchData}
        selectedid={selectedid}
      />
    </>
  );
};

export default Page;
