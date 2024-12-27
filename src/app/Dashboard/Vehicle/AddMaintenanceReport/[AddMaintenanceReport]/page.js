"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddMaintenanceModel from "../AddMaintenanceModal/AddmaintenanceModel";
import { API_URL_Maintainance } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName, getUserName } from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";

const Page = ({ params }) => {
  const addmaintenancereportId = params.AddMaintenanceReport;
  console.log("addmain page id", addmaintenancereportId);
  // const [searchTerm, setSearchTerm] = useState("");
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
      const response = await axios.get(`${API_URL_Maintainance}`);
      // console.log("data is", response);
      setData(response.data.result);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Maintainance}/${id}`);
      if (response.data.success) {
        setData((prev) => prev.filter((item) => item._id !== id));
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.error);
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

    const filtered = data.filter(
      (item) =>
        username === item.asignto &&
        item.adminCompanyName?.toLowerCase() === companyName.toLowerCase()
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, data);

  const toggleTitleModal = () => {
    // console.log("model click");
    setIsOpenTitle((prev) => !prev);
    setselectedid(addmaintenancereportId);
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
    doc.setFontSize(12);
    doc.text("Maintenance Records Report", 14, 10);

    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Report Generated: ${reportDate}`, 14, 15);
    const VehicleName = filteredData[0]?.vehicleName || "Name Unavailable";
    doc.text(`Vehicle Name: ${VehicleName}`, 14, 20);
    const vehicleRegistration =
      filteredData[0]?.registrationNumber || "Registration Unavailable";
    doc.text(`Registration Number: ${vehicleRegistration}`, 14, 25);
    doc.text(`Company Name: ${selectedCompanyName}`, 14, 30);

    // Define table columns
    const tableColumn = [
      "Issues",
      "Organisation",
      "Repair Status",
      "Job Number",
      "Memo",
      "Parts",
      "Labour Hours",
      "Cost",
      "Signed Off By",
      "Date",
    ];

    // Calculate available space for columns
    const pageWidth = doc.internal.pageSize.width;
    const startX = 14;
    const startY = 42;
    const padding = 6;
    const lineHeight = 9;
    const columnWidth = 35;
    const pageHeight = doc.internal.pageSize.height;

    // Determine how many columns fit on the page
    const maxColumnsPerRow = Math.floor((pageWidth - startX) / columnWidth);

    let currentY = startY;

    // Function to render column headers
    const renderHeaders = (startIndex) => {
      let currentX = startX;
      for (
        let i = startIndex;
        i < tableColumn.length && i < startIndex + maxColumnsPerRow;
        i++
      ) {
        doc.text(tableColumn[i], currentX + padding, currentY);
        doc.rect(currentX, currentY - 4, columnWidth, lineHeight);
        currentX += columnWidth;
      }
      currentY += lineHeight; // Move down for the row data
    };

    // Add table rows
    filteredData.forEach((row) => {
      row.repairHistory.forEach((repair) => {
        const rowData = [
          row.issues || "N/A",
          row.organisation || "N/A",
          row.repairStatus || "N/A",
          row.jobNumber || "N/A",
          row.memo || "N/A",

          `${repair.partNumber || "N/A"}: ${repair.partName || "N/A"} - $${
            repair.price || 0
          } (${repair.supplier || "N/A"})`,
          row.labourHours || "N/A",
          `$${row.cost || 0}`,
          row.signedOffBy || "N/A",
          (() => {
            const date = new Date(row.date);
            const formattedDate = `${String(date.getMonth() + 1).padStart(
              2,
              "0"
            )}/${String(date.getDate()).padStart(
              2,
              "0"
            )}/${date.getFullYear()}`;
            return formattedDate;
          })() || "N/A",
        ];

        let currentX = startX;

        // Wrap columns into new rows when exceeding max columns per row
        for (let i = 0; i < rowData.length; i++) {
          // Add column headers for new rows
          if (i % maxColumnsPerRow === 0) {
            // Check if a new page is needed
            if (currentY + lineHeight > pageHeight - 20) {
              doc.addPage();
              currentY = 20;
            }
            renderHeaders(i); // Render headers for current set of columns
          }

          // Check if a new page is needed
          if (currentY + lineHeight > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
            renderHeaders(i); // Render headers again on the new page
          }

          // Print the data for each column
          const cellText = doc.splitTextToSize(
            rowData[i],
            columnWidth - padding
          );
          doc.text(cellText, currentX + padding, currentY);
          doc.rect(
            currentX,
            currentY - 4,
            columnWidth,
            lineHeight * cellText.length
          );

          currentX += columnWidth;

          // Wrap to a new line if necessary
          if ((i + 1) % maxColumnsPerRow === 0) {
            currentY += lineHeight * cellText.length;
            currentX = startX;
          }
        }
        // Move to the next row after each entry
        currentY += lineHeight;
      });
    });

    // Save the PDF
    doc.save("Maintenance_Report.pdf");
  };

  return (
    <>
      <Header />
      <div className="flex w-full">
        <Sidebar className="w-4/12" />
        <div className="mx-auto w-10/12 py-2  h-screen">
          <div className="border-2 mt-3 w-full ">
            <div className="flex justify-between">
              {/* <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-4 py-2 w-64"
              /> */}
              <div className="flex gap-2 m-2">
                <button
                  onClick={generatePDF}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Maintenance Report
                </button>
                <button
                  onClick={toggleTitleModal}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Maintenance
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
                        {row.vehicleName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.registrationNumber}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.issues}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.organisation}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.repairStatus}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.jobNumber}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.memo || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.repairHistory.map((part) => (
                          <tr key={part._id}>
                            <td>{part.partNumber}</td>
                          </tr>
                        ))}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.repairHistory.map((part) => (
                          <tr key={part._id}>
                            <td>{part.partName}</td>
                          </tr>
                        ))}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.repairHistory.map((part) => (
                          <tr key={part._id}>
                            <td>{part.price}</td>
                          </tr>
                        ))}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.repairHistory.map((part) => (
                          <tr key={part._id}>
                            <td>{part.supplier || "N/A"}</td>
                          </tr>
                        ))}
                      </td>

                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.labourHours}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.cost}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.signedOffBy}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {(() => {
                          const date = new Date(row.date);
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
                        {row.images && Array.isArray(row.images)
                          ? row.images.length
                          : 0}
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

            <div className="flex justify-center text-center mt-4 gap-1 mb-2">
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
      <AddMaintenanceModel
        isOpen={isOpenTitle}
        onClose={toggleTitleModal}
        fetchData={fetchData}
        selectedid={selectedid}
      />
    </>
  );
};

export default Page;
