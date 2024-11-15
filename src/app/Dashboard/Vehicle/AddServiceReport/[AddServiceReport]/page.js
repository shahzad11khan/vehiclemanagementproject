"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddServiceModal from "../AddServiceModal/AddServiceModal";
import { API_URL_VehicleService } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";

const Page = ({ params }) => {
  const addServiceId = params.AddServiceReport;
  // console.log("ADD Service Id page id", addServiceId);
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
      const response = await axios.get(
        `${API_URL_VehicleService}/${addServiceId}`
      );
      console.log("service Data: ", response.data.result);
      setData(response.data.result);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_VehicleService}/${id}`);
      if (response.data.success) {
        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const companyName = getCompanyName();

    const filtered = data.filter(
      (item) =>
        item.adminCompanyName.toLowerCase() === companyName.toLowerCase()
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data]);

  const toggleTitleModal = () => {
    // console.log("model click");
    setIsOpenTitle((prev) => !prev);
    setselectedid(addServiceId);
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
    doc.text("Services Records Report", 14, 10);

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
      "Service Dates",
      "Service Due Dates",
      "Service Miles",
      "Service Status",
      "Service Assign",
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

      const serviceCurrentDate = doc.splitTextToSize(
        (() => {
          const date = new Date(row.serviceCurrentDate);
          const formattedDate = `${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        })() || "N/A",
        columnWidth - padding
      );

      const serviceDueDate = doc.splitTextToSize(
        (() => {
          const date = new Date(row.serviceDueDate);
          const formattedDate = `${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        })() || "N/A",
        columnWidth - padding
      );

      const servicemailes = doc.splitTextToSize(
        row.servicemailes || "N/A",
        columnWidth - padding
      );

      const serviceStatus = doc.splitTextToSize(
        row.serviceStatus || "N/A",
        columnWidth - padding
      );
      const serviceAssing = doc.splitTextToSize(
        row.asignto || "N/A",
        columnWidth - padding
      );

      const maxCellHeight =
        Math.max(
          serviceCurrentDate.length,
          serviceDueDate.length,
          servicemailes.length,
          serviceStatus.length,
          serviceAssing.length
        ) * lineHeight;

      // Add the data cells with borders
      doc.text(serviceCurrentDate, startX + padding, currentY);
      doc.rect(startX, currentY - 4, columnWidth, maxCellHeight);

      doc.text(serviceDueDate, startX + columnWidth + padding, currentY);
      doc.rect(startX + columnWidth, currentY - 4, columnWidth, maxCellHeight);

      doc.text(servicemailes, startX + 2 * columnWidth + padding, currentY);
      doc.rect(
        startX + 2 * columnWidth,
        currentY - 4,
        columnWidth,
        maxCellHeight
      );

      doc.text(serviceStatus, startX + 3 * columnWidth + padding, currentY);
      doc.rect(
        startX + 3 * columnWidth,
        currentY - 4,
        columnWidth,
        maxCellHeight
      );
      doc.text(serviceAssing, startX + 4 * columnWidth + padding, currentY);
      doc.rect(
        startX + 4 * columnWidth,
        currentY - 4,
        columnWidth,
        maxCellHeight
      );

      // Increment Y for the next row
      currentY += maxCellHeight; // Fix the issue here by using +=
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
                  Add Service
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
                      Service Dates
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Service Due Dates
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Service Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Vehicle Status
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Service Mails
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Service Assign
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
                          const date = new Date(row.serviceCurrentDate);
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
                        {(() => {
                          const date = new Date(row.serviceDueDate);
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
                        {row.serviceStatus || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.VehicleStatus || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.servicemailes || "N/A"}
                      </td>

                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.asignto || "N/A"}
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
      <AddServiceModal
        isOpen={isOpenTitle}
        onClose={toggleTitleModal}
        fetchData={fetchData}
        selectedid={selectedid}
      />
    </>
  );
};

export default Page;
