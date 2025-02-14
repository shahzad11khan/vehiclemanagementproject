"use client";

import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddMaintenanceModel from "../AddMaintenanceModal/AddmaintenanceModel";
import { API_URL_Maintainance } from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName} from "@/utils/storageUtils";
import axios from "axios";
import jsPDF from "jspdf";
import BackButton from "@/app/Dashboard/Components/BackButton";

const Page = ({ params }) => {
  const addmaintenancereportId = params.AddMaintenanceReport;
  console.log("addmain page id", addmaintenancereportId);
  // const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenTitle, setIsOpenTitle] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentRecords, setCurrentRecords] = useState([]);
  const [selectedid, setselectedid] = useState(null);

  console.log(data);
  useEffect(() => {
    const totalPage = Math.ceil(filteredData.length / itemperpage);
    setTotalPages(totalPage);
    const startIndex = (currentPage - 1) * itemperpage;
    const endIndex = currentPage * itemperpage;
    const currentRecord = filteredData.slice(startIndex, endIndex);
    setCurrentRecords(currentRecord);
  }, [data, filteredData, itemperpage, currentPage]);

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

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await axios.delete(`${API_URL_Maintainance}/${id}`);
  //     if (response.data.success) {
  //       setData((prev) => prev.filter((item) => item._id !== id));
  //       toast.success(response.data.message);
  //     } else {
  //       toast.warn(response.data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting:", error);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const companyName = getCompanyName();
    // const username = getUserName();
    console.log("company", companyName);
    // console.log("username",username)

    const filtered = data.filter(
      (item) =>
        // username === item.asignto &&
        item.adminCompanyName?.toLowerCase() === companyName.toLowerCase()
    );
    console.log("filterData", filtered);
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data]);

  const toggleTitleModal = () => {
    // console.log("model click");
    setIsOpenTitle((prev) => !prev);
    setselectedid(addmaintenancereportId);
  };

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
                <span>Road Tax</span>
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
                      className="w-[152px] font-sans  font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[12px] gap-2 items-center justify-center"
                    >
                      <img src="/plus.svg" alt="Add Service" />
                      Add Maintenance
                    </button>
                  </div>
                </div>
              </div>

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
                        Issues/Damages
                      </th>
                      <th className="py-3 px-4 min-w-[165px] w-[165px] md:w-[16.66%] text-start bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Organisation
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Job Number
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center bg-[#38384A] text-white whitespace-normal break-all overflow-hidden">
                        Repair Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans font-medium text-sm">
                    {currentRecords.map((row) => (
                      <tr key={row._id} className="border-b hover:bg-gray-100">
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          Value Not Found yet
                        </td>
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.vehicleName}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.registrationNumber}
                        </td>
                        <td className="py-2 px-4 text-start whitespace-normal break-all overflow-hidden">
                          {row.issues}
                        </td>
                        <td className="py-2 px-4 text-start whitespace-normal break-all overflow-hidden">
                          {row.organisation}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.jobNumber}
                        </td>
                        <td className="py-2 px-4 text-center whitespace-normal break-all overflow-hidden">
                          {row.repairStatus}
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
      <AddMaintenanceModel
        isOpen={isOpenTitle}
        onClose={toggleTitleModal}
        fetchData={fetchData}
        selectedid={selectedid}
      />
    </div>
  );
};

export default Page;
