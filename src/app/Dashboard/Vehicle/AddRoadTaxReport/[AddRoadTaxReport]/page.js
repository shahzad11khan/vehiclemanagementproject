"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddRoadTexModal from "../AddRoadTaxModal/AddRoadTaxModal";
import { GetTitle } from "../../../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { API_URL_Title } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";

const Page = ({ params }) => {
  const addRoadTaxReportId = params.AddRoadTaxReport;
  console.log("ADD Road Taxt page id", addRoadTaxReportId);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenTitle, setIsOpenTitle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedid, setselectedid] = useState(null);
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

  const toggleTitleModal = () => {
    // console.log("model click");
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
    doc.setFontSize(12); // Large font for title
    doc.text("Road Tax Records Report", 14, 10);

    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(10); // Smaller font for the report date
    doc.text(`Report Generated: ${reportDate}`, 14, 15);

    // Display the vehicle name once at the top
    const vehicleName = filteredData[0]?.VehicleName || "Name Unavailable";
    doc.text(`Vehicle Name: ${vehicleName}`, 14, 20);
    const vehicleRegistration =
      filteredData[0]?.registrationNumber || "Registration Unavailable";
    doc.text(`Registration Number: ${vehicleRegistration}`, 14, 25);
    doc.text(`Company Name: ${selectedCompanyName}`, 14, 30);

    // Define table columns and their initial X positions
    const tableColumn = [
      "Issues And Damages",
      "Tax Dates",
      "Tax Cycle",
      "Tax Due Date",
      "Tax Status",
    ];

    let startX = 14;
    let startY = 42; // Adjust to leave space after the vehicle name
    const columnWidth = 37; // Adjusted column width to better fit the page
    const lineHeight = 9; // Height of each row
    const padding = 2; // Padding inside cells
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page

    // Add table header
    tableColumn.forEach((column, index) => {
      doc.text(column, startX + index * columnWidth + padding, startY);
      doc.rect(startX + index * columnWidth, startY - 4, columnWidth, 8);
    });

    // Add table rows
    let currentY = startY + lineHeight;
    filteredData.forEach((row) => {
      // Check if the next row fits within the current page
      if (currentY + lineHeight > pageHeight - 20) {
        doc.addPage(); // Add a new page if the row won't fit
        currentY = 20; // Reset Y to start at the top of the new page
        // Re-add the header on the new page
        tableColumn.forEach((column, index) => {
          doc.text(column, startX + index * columnWidth + padding, currentY);
          doc.rect(startX + index * columnWidth, currentY - 4, columnWidth, 8);
        });
        currentY += lineHeight; // Adjust the Y after the header
      }
      const issuesAndDamages = doc.splitTextToSize(
        row.issuesAndDamages || "N/A",
        columnWidth - padding
      );
      const roadTaxDates = doc.splitTextToSize(
        row.roadTaxDates || "N/A",
        columnWidth - padding
      );
      const roadTaxCycle = doc.splitTextToSize(
        row.roadTaxCycle || "N/A",
        columnWidth - padding
      );
      const roadTaxDueDate = doc.splitTextToSize(
        row.roadTaxDueDate || "N/A",
        columnWidth - padding
      );
      const roadTaxStatus = doc.splitTextToSize(
        row.roadTaxStatus || "N/A",
        columnWidth - padding
      );
      const maxCellHeight =
        Math.max(
          issuesAndDamages.length,
          roadTaxDates.length,
          roadTaxCycle.length,
          roadTaxDueDate.length,
          roadTaxStatus.length
        ) * lineHeight;

      // Add the data cells with borders
      doc.text(issuesAndDamages, startX + padding, currentY);
      doc.rect(startX, currentY - 4, columnWidth, maxCellHeight);

      doc.text(roadTaxDates, startX + columnWidth + padding, currentY);
      doc.rect(startX + columnWidth, currentY - 4, columnWidth, maxCellHeight);
      doc.text(roadTaxCycle, startX + 2 * columnWidth + padding, currentY);
      doc.rect(
        startX + 2 * columnWidth,
        currentY - 4,
        columnWidth,
        maxCellHeight
      );
      doc.text(roadTaxDueDate, startX + 3 * columnWidth + padding, currentY);
      doc.rect(
        startX + 3 * columnWidth,
        currentY - 4,
        columnWidth,
        maxCellHeight
      );

      doc.text(roadTaxStatus, startX + 4 * columnWidth + padding, currentY);
      doc.rect(
        startX + 4 * columnWidth,
        currentY - 4,
        columnWidth,
        maxCellHeight
      );

      // Increment Y for the next row
      currentY + maxCellHeight;
    });

    // Save the PDF
    doc.save("Road_Tax_Report.pdf");
  };

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
              <div className="flex gap-2">
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
                      Issues And Damages
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Road Tax Dates
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Road Tax Cycle
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Road Tax Due Date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Road Tax Status
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
