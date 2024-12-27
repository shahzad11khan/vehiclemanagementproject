"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddServiceModal from "../AddServiceModal/AddServiceModal";
import { API_URL_VehicleService } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName, getUserName } from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const router = useRouter();
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

  // const generatePDF = () => {
  //   const doc = new jsPDF();
  
  //   // Helper function to format the date in MM/DD/YYYY format
  //   const formatDate = (date) => {
  //     const formattedDate = new Date(date);
  //     return `${String(formattedDate.getMonth() + 1).padStart(2, "0")}/${String(formattedDate.getDate()).padStart(2, "0")}/${formattedDate.getFullYear()}`;
  //   };
  
  //   // Page setup
  //   const pageWidth = doc.internal.pageSize.width;
  //   const pageHeight = doc.internal.pageSize.height;
  //   const margin = 14; // Left margin
  //   const headerHeight = 10; // Space for the header
  //   const footerHeight = 10; // Space for the footer
  //   const lineHeight = 8; // Line height for rows
  //   const padding = 2; // Padding inside cells
  
  //   // Column configuration
  //   const tableColumn = [
  //     { name: "Service Dates", width: 30 },
  //     { name: "Due Dates", width: 25 },
  //     { name: "Service Miles", width: 25 },
  //     { name: "Status", width: 35 },
  //     { name: "Service Assign", width: 50 },
  //   ];
  
  //   const tableWidth = tableColumn.reduce((sum, col) => sum + col.width, 0);
  
  //   // Draw header and footer
  //   const addHeader = () => {
  //     doc.setFontSize(14);
  //     doc.setFont("helvetica", "bold"); // Title in bold
  //     doc.text("Services Records Report", pageWidth / 2, 10, { align: "center" });
  
  //     doc.setFontSize(10);
  //     doc.setFont("helvetica", "normal"); // Regular font for the text below the title
  //     const reportDate = new Date().toLocaleDateString();
  //     doc.text(`Report Generated: ${reportDate}`, margin, 20);
  
  //     // Vehicle details
  //     const vehicleName = filteredData[0]?.VehicleName || "Name Unavailable";
  //     const vehicleRegistration =
  //       filteredData[0]?.registrationNumber || "Registration Unavailable";
  
  //     doc.text(`Vehicle Name: ${vehicleName}`, margin, 25);
  //     doc.text(`Registration Number: ${vehicleRegistration}`, margin, 30);
  //     doc.text(`Company Name: ${selectedCompanyName}`, margin, 35);
  //   };
  
  //   const addFooter = (pageNumber) => {
  //     doc.setFontSize(10);
  //     doc.text(
  //       `Page ${pageNumber}`,
  //       pageWidth / 2,
  //       pageHeight - footerHeight,
  //       { align: "center" }
  //     );
  //   };
  
  //   // Draw table header (headings in bold)
  //   const drawTableHeader = (startY) => {
  //     let currentX = margin;
  //     doc.setFont("helvetica", "bold"); // Column headings in bold
  //     tableColumn.forEach((col) => {
  //       doc.text(col.name, currentX + padding, startY);
  //       doc.rect(currentX, startY - lineHeight, col.width, lineHeight);
  //       currentX += col.width;
  //     });
  //     return startY + lineHeight; // Return the next Y position
  //   };
  
  //   // Draw table rows (content in normal font)
  //   const drawTableRow = (row, startY) => {
  //     let currentX = margin;
  //     const cellData = [
  //       row.serviceCurrentDate ? formatDate(row.serviceCurrentDate) : "N/A",  // Format serviceCurrentDate
  //       row.serviceDueDate ? formatDate(row.serviceDueDate) : "N/A",        // Format serviceDueDate
  //       row.servicemailes || "N/A",
  //       row.serviceStatus || "N/A",
  //       row.asignto || "N/A",
  //     ];
  
  //     const maxCellHeight = Math.max(
  //       ...cellData.map((text) =>
  //         doc.splitTextToSize(text, tableColumn[0].width - padding).length
  //       )
  //     ) * lineHeight;
  
  //     doc.setFont("helvetica", "normal"); // Normal font for the rows
  //     cellData.forEach((text, index) => {
  //       const cellText = doc.splitTextToSize(text, tableColumn[index].width - padding);
  //       doc.text(cellText, currentX + padding, startY);
  //       doc.rect(
  //         currentX,
  //         startY - lineHeight,
  //         tableColumn[index].width,
  //         maxCellHeight
  //       );
  //       currentX += tableColumn[index].width;
  //     });
  
  //     return maxCellHeight; // Return cell height for next row positioning
  //   };
  
  //   // Main content rendering
  //   let currentY = 45; // Start after vehicle details
  //   let pageNumber = 1;
  //   addHeader();
  
  //   // Add table header
  //   currentY = drawTableHeader(currentY);
  
  //   filteredData.forEach((row) => {
  //     const cellHeight = drawTableRow(row, currentY);
  
  //     // Check if we need a new page
  //     if (currentY + cellHeight + footerHeight > pageHeight) {
  //       addFooter(pageNumber);
  //       doc.addPage();
  //       pageNumber++;
  //       addHeader();
  //       currentY = 45; // Reset Y for the new page
  //       currentY = drawTableHeader(currentY);
  //     }
  
  //     currentY += cellHeight;
  //   });
  
  //   addFooter(pageNumber);
  
  //   // Save the PDF
  //   doc.save("Services_Records_Report.pdf");
  // };
  



  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Helper function to format the date in MM/DD/YYYY format
    const formatDate = (date) => {
      const formattedDate = new Date(date);
      return `${String(formattedDate.getMonth() + 1).padStart(2, "0")}/${String(formattedDate.getDate()).padStart(2, "0")}/${formattedDate.getFullYear()}`;
    };
  
    // Page setup
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14; // Left margin
    // const headerHeight = 10; // Space for the header
    const footerHeight = 10; // Space for the footer
    const rowHeight = 10; // Fixed row height
    const padding = 2; // Padding inside cells
  
    // Column configuration
    const tableColumn = [
      { name: "Service Dates", width: 30 },
      { name: "Due Dates", width: 25 },
      { name: "Service Miles", width: 25 },
      { name: "Status", width: 35 },
      { name: "Service Assign", width: 65 },
    ];
  
    // const tableWidth = tableColumn.reduce((sum, col) => sum + col.width, 0);
  
    // Draw header and footer
    const addHeader = () => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold"); // Title in bold
      doc.text("Services Records Report", pageWidth / 2, 10, { align: "center" });
  
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal"); // Regular font for the text below the title
      const reportDate = new Date().toLocaleDateString();
      doc.text(`Report Generated: ${reportDate}`, margin, 20);
  
      // Vehicle details
      const vehicleName = filteredData[0]?.VehicleName || "Name Unavailable";
      const vehicleRegistration = filteredData[0]?.registrationNumber || "Registration Unavailable";
  
      doc.text(`Vehicle Name: ${vehicleName}`, margin, 25);
      doc.text(`Registration Number: ${vehicleRegistration}`, margin, 30);
      doc.text(`Company Name: ${selectedCompanyName}`, margin, 35);
    };
  
    const addFooter = (pageNumber) => {
      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber}`,
        pageWidth / 2,
        pageHeight - footerHeight,
        { align: "center" }
      );
    };
  
    // Draw table header (headings in bold)
    const drawTableHeader = (startY) => {
      let currentX = margin;
      doc.setFont("helvetica", "bold"); // Column headings in bold
      tableColumn.forEach((col) => {
        doc.text(col.name, currentX + padding, startY + 5 );
        doc.rect(currentX, startY, col.width, rowHeight); // Draw table header cell
        currentX += col.width;
      });
      return startY + rowHeight; // Return the next Y position
    };
  
    // Draw table rows (content in normal font)
    const drawTableRow = (row, startY) => {
      let currentX = margin;
      const cellData = [
        row.serviceCurrentDate ? formatDate(row.serviceCurrentDate) : "N/A", // Format serviceCurrentDate
        row.serviceDueDate ? formatDate(row.serviceDueDate) : "N/A",       // Format serviceDueDate
        row.servicemailes || "N/A",
        row.serviceStatus || "N/A",
        row.asignto || "N/A",
      ];
  
      doc.setFont("helvetica", "normal"); // Normal font for the rows
      cellData.forEach((text, index) => {
        const cellText = doc.splitTextToSize(text, tableColumn[index].width - padding * 2);
  
        // Vertically center the text within the fixed row height
        const verticalAlign = startY + rowHeight / 2 - (doc.getTextDimensions(cellText).h / 2);
  
        // Align text horizontally (left-align for dates and miles, centered for others)
        const horizontalAlign = (index === 1 || index === 2) ? currentX + padding : currentX + (tableColumn[index].width - doc.getTextDimensions(cellText).w) / 2;
  
        doc.text(cellText, horizontalAlign, verticalAlign);
        doc.rect(currentX, startY, tableColumn[index].width, rowHeight); // Draw the cell border
        currentX += tableColumn[index].width;
      });
  
      return rowHeight; // Return the fixed height for the row
    };
  
    // Main content rendering
    let currentY = 45; // Start after vehicle details
    let pageNumber = 1;
    addHeader();
  
    // Add table header
    currentY = drawTableHeader(currentY);
  
    filteredData.forEach((row) => {
      const cellHeight = drawTableRow(row, currentY);
  
      // Check if we need a new page
      if (currentY + cellHeight + footerHeight > pageHeight) {
        addFooter(pageNumber);
        doc.addPage();
        pageNumber++;
        addHeader();
        currentY = 45; // Reset Y for the new page
        currentY = drawTableHeader(currentY);
      }
  
      currentY += cellHeight;
    });
  
    addFooter(pageNumber);
  
    // Save the PDF
    doc.save("Services_Records_Report.pdf");
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
                          // Format the date as MM/DD/YYYY
                          const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
                          return formattedDate;
                        })() || "N/A"}
                      </td>

                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.serviceStatus || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.VehicleStatus === true ? "True" : "False"}
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
