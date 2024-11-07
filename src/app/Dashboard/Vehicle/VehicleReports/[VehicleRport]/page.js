"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";

const Page = ({ params }) => {
  const id = params.VehicleRport;
  const [data, setData] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL_Vehicle}/${id}`);
        const vehicleData = response.data.result;
        console.log(vehicleData);
        setData(vehicleData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const handleDownloadReport = () => {
    const doc = new jsPDF();

    // Set title and report date
    doc.setFontSize(12); // Large font for title
    doc.text("Car All Records Report", 14, 10);

    const reportDate = new Date().toLocaleDateString();
    doc.setFontSize(10); // Smaller font for the report date
    doc.text(`Report Generated: ${reportDate}`, 14, 15);

    // Display the vehicle name once at the top
    const vehicleName = data.model || "Name Unavailable";
    doc.text(`Vehicle Name: ${vehicleName}`, 14, 20);
    const vehicleRegistration =
      data.registrationNumber || "Registration Unavailable";
    doc.text(`Registration Number: ${vehicleRegistration}`, 14, 25);
    const selectedCompanyName = getCompanyName();
    doc.text(`Company Name: ${selectedCompanyName}`, 14, 30);

    // Define table columns and their initial X positions
    const tableColumn = [
      "Manufacturer",
      "Authority",
      "Engine Type",
      "Drive Train",
      "Transmission",
      "ExteriorColor",
      "InteriorColor",
    ];
    let startX = 14;
    let startY = 42; // Adjust to leave space after the vehicle name
    const columnWidth = 30; // Adjusted column width to better fit the page
    const lineHeight = 9; // Height of each row
    const padding = 2; // Padding inside cells
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page

    // Add table header
    tableColumn.forEach((column, index) => {
      doc.text(column, startX + index * columnWidth + padding, startY);
      doc.rect(startX + index * columnWidth, startY - 4, columnWidth, 8);
    });

    // Add table rows for the single vehicle record
    let currentY = startY + lineHeight;

    // Prepare data for each column
    const manufacturer = doc.splitTextToSize(
      data.manufacturer || "N/A",
      columnWidth - padding
    );
    const LocalAuthority = doc.splitTextToSize(
      data.LocalAuthority || "N/A",
      columnWidth - padding
    );
    const engineType = doc.splitTextToSize(
      data.engineType || "N/A",
      columnWidth - padding
    );
    const drivetrain = doc.splitTextToSize(
      data.drivetrain || "N/A",
      columnWidth - padding
    );
    const transmission = doc.splitTextToSize(
      data.transmission || "N/A",
      columnWidth - padding
    );
    const exteriorColor = doc.splitTextToSize(
      data.exteriorColor || "N/A",
      columnWidth - padding
    );
    const interiorColor = doc.splitTextToSize(
      data.interiorColor || "N/A",
      columnWidth - padding
    );

    // Find the maximum number of lines across all columns
    const maxLines = Math.max(
      manufacturer.length,
      LocalAuthority.length,
      engineType.length,
      drivetrain.length,
      transmission.length,
      exteriorColor.length,
      interiorColor.length
    );

    // Loop through all rows of data
    for (let rowIndex = 0; rowIndex < maxLines; rowIndex++) {
      let currentX = startX;

      // Add each cell's text and border
      const columnsData = [
        manufacturer[rowIndex] || "",
        LocalAuthority[rowIndex] || "",
        engineType[rowIndex] || "",
        drivetrain[rowIndex] || "",
        transmission[rowIndex] || "",
        exteriorColor[rowIndex] || "",
        interiorColor[rowIndex] || "",
      ];

      columnsData.forEach((text) => {
        doc.text(text, currentX + padding, currentY);
        doc.rect(currentX, currentY - 4, columnWidth, lineHeight); // Border around the cell
        currentX += columnWidth; // Move to the next column
      });

      // Move to the next row
      currentY += lineHeight;

      // If the content exceeds the page height, add a new page
      if (currentY > pageHeight - 20) {
        doc.addPage(); // Add a new page if the content exceeds the page height
        currentY = 20; // Reset Y to start at the top of the new page
      }
    }

    // Save the PDF
    doc.save("Vehicle_Report.pdf");
  };

  if (!isMounted) return null;

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between">
              <button
                onClick={handleDownloadReport}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download Report
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2">Vehicle Name</th>
                    <th className="text-left px-4 py-2">Registration Number</th>
                    <th className="text-left px-4 py-2">
                      Vehicle Local Authority
                    </th>
                    <th className="text-left px-4 py-2">Engine Type</th>
                    <th className="text-left px-4 py-2">Drive Train</th>
                    <th className="text-left px-4 py-2">Status</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {data ? (
                    <tr
                      key={data._id}
                      className={
                        data._id % 2 === 0 ? "bg-gray-200" : "bg-white"
                      }
                    >
                      <td className="text-left px-4 py-2">
                        {data.model || "N/A"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {data.registrationNumber || "N/A"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {data.LocalAuthority || "N/A"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {data.engineType || "N/A"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {data.drivetrain || "N/A"}
                      </td>
                      <td className="text-left px-4 py-2">
                        {data.isActive ? "Active" : "Inactive"}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No data available
                      </td>
                    </tr>
                  )}
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
