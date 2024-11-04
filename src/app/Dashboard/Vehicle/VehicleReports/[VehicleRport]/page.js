"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { IoIosInformationCircle } from "react-icons/io";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import Link from "next/link";
import { API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";

const Page = ({ params }) => {
  const id = params.VehicleRport;
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedLog, setSelectedLog] = useState("All"); // Track the selected log
  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL_Vehicle}/${id}`);
      setData(response.data.result || []);
      setFilteredData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const companyName = getCompanyName();
    const filtered = data.filter((item) => {
      const companyMatch =
        item.adminCompanyName &&
        companyName &&
        item.adminCompanyName.toLowerCase() === companyName.toLowerCase();
      const usernameMatch =
        item.model &&
        item.model.toLowerCase().includes(searchTerm.toLowerCase());
      if (selectedLog === "All") return companyMatch && usernameMatch;
      return companyMatch && usernameMatch && item.logType === selectedLog;
    });
    setFilteredData(filtered);
  }, [searchTerm, data, selectedCompanyName]);

  const handleDownloadReport = () => {
    const doc = new jsPDF();

    // Set document title based on the selected log
    const reportTitle = selectedLog === "All" ? "Vehicle Report" : selectedLog;
    doc.setFontSize(16);
    doc.text(reportTitle, 10, 10);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, 20);

    // Table headers based on selected log type
    let yPos = 30;
    if (selectedLog === "All") {
      doc.text("Vehicle Name", 10, yPos);
      doc.text("Local Authority", 50, yPos);
      doc.text("Engine Type", 90, yPos);
      doc.text("Drive Train", 130, yPos);
      doc.text("Registration Number", 170, yPos);
      doc.text("Status", 210, yPos);
      yPos += 10;

      // Table rows for "All"
      filteredData.forEach((item) => {
        doc.text(item.model || "-", 10, yPos);
        doc.text(item.LocalAuthority || "-", 50, yPos);
        doc.text(item.engineType || "-", 90, yPos);
        doc.text(item.drivetrain || "-", 130, yPos);
        doc.text(
          item.registrationNumber ? item.registrationNumber.toString() : "0",
          170,
          yPos
        );
        doc.text(item.isActive ? "Active" : "Inactive", 210, yPos);
        yPos += 10;
      });
    } else if (selectedLog === "Maintenance Log") {
      doc.text("Vehicle Name", 10, yPos);
      doc.text("Maintenance Details", 50, yPos);
      yPos += 10;

      // Table rows for "Maintenance Log"
      filteredData.forEach((item) => {
        doc.text(item.model || "-", 10, yPos);
        doc.text(item.maintenanceDetails || "N/A", 50, yPos);
        yPos += 10;
      });
    } else if (selectedLog === "Road Tax Log") {
      doc.text("Vehicle Name", 10, yPos);
      doc.text("Road Tax Cost", 50, yPos);
      yPos += 10;

      // Table rows for "Road Tax Log"
      filteredData.forEach((item) => {
        doc.text(item.model || "-", 10, yPos);
        doc.text(item.roadTaxCost || "N/A", 50, yPos);
        yPos += 10;
      });
    } else if (selectedLog === "Service Log") {
      doc.text("Vehicle Name", 10, yPos);
      doc.text("Service Details", 50, yPos);
      yPos += 10;

      // Table rows for "Service Log"
      filteredData.forEach((item) => {
        doc.text(item.model || "-", 10, yPos);
        doc.text(item.serviceDetails || "N/A", 50, yPos);
        yPos += 10;
      });
    } else if (selectedLog === "MOT Log") {
      doc.text("Vehicle Name", 10, yPos);
      doc.text("MOT Cycle", 50, yPos);
      yPos += 10;

      // Table rows for "MOT Log"
      filteredData.forEach((item) => {
        doc.text(item.model || "-", 10, yPos);
        doc.text(item.motCycle || "N/A", 50, yPos);
        yPos += 10;
      });
    } else if (selectedLog === "Mileage Log") {
      doc.text("Vehicle Name", 10, yPos);
      doc.text("Mileage on Fleet Exit", 50, yPos);
      yPos += 10;

      // Table rows for "Mileage Log"
      filteredData.forEach((item) => {
        doc.text(item.model || "-", 10, yPos);
        doc.text(item.milesOnFleetExit || "N/A", 50, yPos);
        yPos += 10;
      });
    }

    // Save the PDF
    // Save the PDF with a filename based on the selected log type
    const filename =
      selectedLog === "All"
        ? "Vehicle_Report.pdf"
        : `${selectedLog}_Report.pdf`;
    doc.save(filename);
  };

  if (!isMounted) {
    return null;
  }
  const handleLogFilter = (logType) => {
    console.log(logType);
    setSelectedLog(logType);
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-4 py-2 w-64"
              />
              <button
                onClick={handleDownloadReport}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download Report
              </button>
            </div>
            <div>
              <div className="flex gap-2 mt-4">
                {[
                  "All",
                  "Maintenance Log",
                  "Road Tax Log",
                  "Service Log",
                  "MOT Log",
                  "Mileage Log",
                ].map((logType) => (
                  <button
                    key={logType}
                    onClick={() => handleLogFilter(logType)}
                    className={`px-4 py-2 rounded ${
                      selectedLog === logType
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {logType}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedLog === "All" && (
                      <>
                        <th>Vehicle Name</th>
                        <th>Vehicle Local Authority</th>
                        <th>Engine Type</th>
                        <th>Drive Train</th>
                        <th>Registration Number</th>
                        <th>Status</th>
                      </>
                    )}
                    {selectedLog === "Maintenance Log" && (
                      <>
                        <th>Vehicle Name</th>
                        <th>Maintenance Details</th>
                        {/* Add other Maintenance Log headers if needed */}
                      </>
                    )}
                    {selectedLog === "Road Tax Log" && (
                      <>
                        <th>Vehicle Name</th>
                        <th>Road Tax Cost</th>
                        {/* Add other Road Tax Log headers if needed */}
                      </>
                    )}
                    {selectedLog === "Service Log" && (
                      <>
                        <th>Vehicle Name</th>
                        <th>Service Details</th>
                        {/* Add other Service Log headers if needed */}
                      </>
                    )}
                    {selectedLog === "MOT Log" && (
                      <>
                        <th>Vehicle Name</th>
                        <th>MOT Cycle</th>
                        {/* Add other MOT Log headers if needed */}
                      </>
                    )}
                    {selectedLog === "Mileage Log" && (
                      <>
                        <th>Vehicle Name</th>
                        <th>Mileage on Fleet Exit</th>
                        {/* Add other Mileage Log headers if needed */}
                      </>
                    )}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => {
                    if (selectedLog === "All") {
                      return (
                        <tr
                          key={item._id}
                          // className={i % 2 === 1 ? "bg-red-400" : "bg-white"}
                        >
                          <td>{item.model}</td>
                          <td>{item.LocalAuthority}</td>
                          <td>{item.engineType}</td>
                          <td>{item.drivetrain}</td>
                          <td>{item.registrationNumber || 0}</td>
                          <td>{item.isActive ? "Active" : "Inactive"}</td>
                        </tr>
                      );
                    } else if (selectedLog === "Maintenance Log") {
                      return (
                        <tr key={item._id}>
                          <td>{item.model}</td>
                          <td>{item.maintenanceDetails || "N/A"}</td>
                          {/* Add other fields specific to the Maintenance Log as needed */}
                        </tr>
                      );
                    } else if (selectedLog === "Road Tax Log") {
                      return (
                        <tr key={item._id}>
                          <td>{item.model}</td>
                          <td>{item.roadTaxCost || "N/A"}</td>
                          {/* Add other fields specific to the Road Tax Log as needed */}
                        </tr>
                      );
                    } else if (selectedLog === "Service Log") {
                      return (
                        <tr key={item._id}>
                          <td>{item.model}</td>
                          <td>{item.serviceDetails || "N/A"}</td>
                          {/* Add other fields specific to the Service Log as needed */}
                        </tr>
                      );
                    } else if (selectedLog === "MOT Log") {
                      return (
                        <tr key={item._id}>
                          <td>{item.model}</td>
                          <td>{item.motCycle || "N/A"}</td>
                          {/* Add other fields specific to the MOT Log as needed */}
                        </tr>
                      );
                    } else if (selectedLog === "Mileage Log") {
                      return (
                        <tr key={item._id}>
                          <td>{item.model}</td>
                          <td>{item.milesOnFleetExit || "N/A"}</td>
                          {/* Add other fields specific to the Mileage Log as needed */}
                        </tr>
                      );
                    }
                    return null; // Return null if none of the conditions match
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
