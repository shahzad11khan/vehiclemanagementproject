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
import BackButton from "@/app/Dashboard/Components/BackButton";

const Page = ({ params }) => {
  const router = useRouter();
  const addServiceId = params.AddServiceReport;
  // console.log("ADD Service Id page id", addServiceId);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenTitle, setIsOpenTitle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);
  const [selectedid, setselectedid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentRecords, setCurrentRecords] = useState([]);

  useEffect(() => {
    const totalPage = Math.ceil(filteredData.length / itemperpage);
    setTotalPages(totalPage);
    const startIndex = (currentPage - 1) * itemperpage;
    const endIndex = currentPage * itemperpage;
    const currentRecord = filteredData.slice(startIndex, endIndex);
    setCurrentRecords(currentRecord);
  }, [data, filteredData, itemperpage, currentPage]);

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


  const generatePDF = () => {
    const doc = new jsPDF();

    // Helper function to format the date in MM/DD/YYYY format
    const formatDate = (date) => {
      const formattedDate = new Date(date);
      return `${String(formattedDate.getMonth() + 1).padStart(2, "0")}/${String(
        formattedDate.getDate()
      ).padStart(2, "0")}/${formattedDate.getFullYear()}`;
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
      doc.text("Services Records Report", pageWidth / 2, 10, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal"); // Regular font for the text below the title
      const reportDate = new Date().toLocaleDateString();
      doc.text(`Report Generated: ${reportDate}`, margin, 20);

      // Vehicle details
      const vehicleName = filteredData[0]?.VehicleName || "Name Unavailable";
      const vehicleRegistration =
        filteredData[0]?.registrationNumber || "Registration Unavailable";

      doc.text(`Vehicle Name: ${vehicleName}`, margin, 25);
      doc.text(`Registration Number: ${vehicleRegistration}`, margin, 30);
      doc.text(`Company Name: ${selectedCompanyName}`, margin, 35);
    };

    const addFooter = (pageNumber) => {
      doc.setFontSize(10);
      doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - footerHeight, {
        align: "center",
      });
    };

    // Draw table header (headings in bold)
    const drawTableHeader = (startY) => {
      let currentX = margin;
      doc.setFont("helvetica", "bold"); // Column headings in bold
      tableColumn.forEach((col) => {
        doc.text(col.name, currentX + padding, startY + 5);
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
        row.serviceDueDate ? formatDate(row.serviceDueDate) : "N/A", // Format serviceDueDate
        row.servicemailes || "N/A",
        row.serviceStatus || "N/A",
        row.asignto || "N/A",
      ];

      doc.setFont("helvetica", "normal"); // Normal font for the rows
      cellData.forEach((text, index) => {
        const cellText = doc.splitTextToSize(
          text,
          tableColumn[index].width - padding * 2
        );

        // Vertically center the text within the fixed row height
        const verticalAlign =
          startY + rowHeight / 2 - doc.getTextDimensions(cellText).h / 2;

        // Align text horizontally (left-align for dates and miles, centered for others)
        const horizontalAlign =
          index === 1 || index === 2
            ? currentX + padding
            : currentX +
              (tableColumn[index].width - doc.getTextDimensions(cellText).w) /
                2;

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
    <div className="h-[100vh] overflow-hidden">
      <Header className="min-w-full" />
      <div className="flex gap-4 w-full">
        <Sidebar />
        <div
          className="w-[80%] xl:w-[85%] h-screen flex flex-col justify-start overflow-y-auto pr-4"
          style={{
            height: "calc(100vh - 90px)",
          }}
        >
          <h1 className="text-[#313342] font-medium text-2xl py-5 pb-8  flex gap-2 items-center">
            <div className="myborder flex gap-3 border-2 border-t-0 border-l-0 border-r-0">
              <span className="opacity-65">Vehicle</span>
              <div className="flex items-center gap-3 myborder2">
                <span>
                  <img
                    src="/setting_arrow.svg"
                    className="w-2 h-4 object-cover object-center  "
                  ></img>
                </span>
                <span>Car MOT</span>
              </div>
            </div>
          </h1>

          <div className="py-5">
            <div className="drop-shadow-custom4">

              <div className="flex justify-between w-full py-2 px-2">
                <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">

                  <div className="flex  gap-7 items-center">
                    {/* Entries Selection */}
                    <div className="md:flex gap-3 hidden items-center">
                      <div className="font-sans font-medium text-sm">Show</div>
                      <div>
                        <select
                          value={itemperpage}
                          onChange={(e) => {
                            setitemperpage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="rounded-lg w-12 px-1 h-8 bg-[#E0E0E0] focus:outline-none"
                        >
                          <option disabled>0</option>
                          {Array.from({ length: 10 }, (_, i = 1) => i + 1).map(
                            (number) => (
                              <option key={number} value={number}>
                                {number}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div className="font-sans font-medium text-sm">
                        Entries
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src="/search.svg"
                          className="absolute left-3 top-2"
                          alt="Search Icon"
                        />
                        <input
                          type="text"
                          placeholder="Search by Vehicle"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <BackButton />
                    <button
                      onClick={generatePDF}
                      className={`font-sans text-sm font-semibold  px-5 h-10  border-[1px] rounded-lg border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500`}
                    >
                      Download Report
                    </button>
                    <button
                      onClick={toggleTitleModal}
                      className="w-[132px] font-sans  font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[12px] gap-2 items-center justify-center"
                    >
                      <img src="/plus.svg" alt="Add Service" />
                      Add Service
                    </button>
                  </div>
                </div>
              </div>
              
              {/* table */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full bg-white border table-auto">
                  <thead className="font-sans font-bold text-sm text-left bg-[#38384A] text-white">
                    <tr>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Assigned To
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Vehicle Name
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                      Registration No
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Service Dates
                      </th>
                      <th className="py-3 px-4 min-w-[158px] w-[158px] md:w-[16.66%] text-start bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Service Due Dates
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Service Miles
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Service Status
                      </th>
                      {/* <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Vehicle Status
                      </th> */}
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans font-medium text-sm">
                    {currentRecords.map((row) => (
                      <tr key={row._id} className="border-b hover:bg-gray-100">
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.asignto || "N/A"}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.VehicleName}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.registrationNumber}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start whitespace-normal break-all overflow-hidden">
                          {(() => {
                            const date = new Date(row.serviceCurrentDate);
                            return `${String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            )}/${String(date.getDate()).padStart(
                              2,
                              "0"
                            )}/${date.getFullYear()}`;
                          })() || "N/A"}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-start whitespace-normal break-all overflow-hidden">
                          {(() => {
                            const date = new Date(row.serviceDueDate);
                            return `${String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            )}/${String(date.getDate()).padStart(
                              2,
                              "0"
                            )}/${date.getFullYear()}`;
                          })() || "N/A"}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.servicemailes || "N/A"}
                        </td>
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.serviceStatus || "N/A"}
                        </td>
                        {/* <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {row.VehicleStatus ? "True" : "False"}
                        </td> */}
                        <td className="py-2 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <img
                              src="/trash.png"
                              alt="delete"
                              className="w-6"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center py-5 font-montserrat font-medium text-[12px]">
                <nav>
                  <ul className="flex items-center gap-3">
                    {/* Previous Button */}
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`h-8 px-2 border rounded-lg ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      >
                        Previous
                      </button>
                    </li>

                    {/* Pagination Logic */}
                    {totalPages > 1 && (
                      <>
                        {totalPages <= 3 ? (
                          // Show all pages if total pages are 3 or fewer
                          Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                          ).map((page) => (
                            <li key={page}>
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 border rounded-lg ${
                                  currentPage === page
                                    ? "bg-custom-bg text-white"
                                    : "bg-white"
                                }`}
                              >
                                {page}
                              </button>
                            </li>
                          ))
                        ) : (
                          // Handle cases where total pages > 3
                          <>
                            {currentPage === 1 && (
                              <>
                                <li>
                                  <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                    1
                                  </button>
                                </li>
                                <li>
                                  <span className="px-2">...</span>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="h-8 w-8 border rounded-lg bg-white"
                                  >
                                    {totalPages}
                                  </button>
                                </li>
                              </>
                            )}
                            {currentPage > 1 && currentPage < totalPages && (
                              <>
                                <li>
                                  <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                    {currentPage}
                                  </button>
                                </li>
                                <li>
                                  <span className="px-2">...</span>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="h-8 w-8 border rounded-lg bg-white"
                                  >
                                    {totalPages}
                                  </button>
                                </li>
                              </>
                            )}
                            {currentPage === totalPages && (
                              <li>
                                <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                  {totalPages}
                                </button>
                              </li>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* Next Button */}
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`h-8 px-2 border rounded-lg ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              {/* pagination ends here  */}
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
    </div>
  );
};

export default Page;
