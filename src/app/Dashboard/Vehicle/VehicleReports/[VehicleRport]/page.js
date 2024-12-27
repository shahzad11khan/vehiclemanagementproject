// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { jsPDF } from "jspdf";
// import Header from "../../../Components/Header";
// import Sidebar from "../../../Components/Sidebar";
// import { API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
// import { getCompanyName } from "@/utils/storageUtils";
// import { isAuthenticated } from "@/utils/verifytoken";
// import { useRouter } from "next/navigation";

// const Page = ({ params }) => {
//   const router = useRouter();
//   const id = params.VehicleRport;
//   const [data, setData] = useState(null);
//   const [isMounted, setIsMounted] = useState(false);
//   useEffect(() => {
//     if (!isAuthenticated()) {
//       router.push("/");
//       return;
//     }
//   }, [router]);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_URL_Vehicle}/${id}`);
//         const vehicleData = response.data.result;
//         console.log(vehicleData);
//         setData(vehicleData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const handleDownloadReport = () => {
//     const doc = new jsPDF();

//     // Set title and report date
//     doc.setFontSize(12);
//     doc.text("Car All Records Report", 14, 10);

//     const reportDate = new Date().toLocaleDateString();
//     doc.setFontSize(10);
//     doc.text(`Report Generated: ${reportDate}`, 14, 15);

//     // Display vehicle details
//     const vehicleName = data?.model || "Name Unavailable";
//     const vehicleRegistration =
//       data?.registrationNumber || "Registration Unavailable";
//     const selectedCompanyName = getCompanyName();

//     doc.text(`Vehicle Name: ${vehicleName}`, 14, 20);
//     doc.text(`Registration Number: ${vehicleRegistration}`, 14, 25);
//     doc.text(`Company Name: ${selectedCompanyName}`, 14, 30);

//     // Define table columns
//     const tableColumn = [
//       "Manufacturer",
//       "Authority",
//       "Engine Type",
//       "Drive Train",
//       "Transmission",
//       "Exterior Color",
//       "Interior Color",
//     ];

//     // Set up dimensions and spacing
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     const startX = 14;
//     const startY = 42;
//     const columnWidth = 35;
//     const lineHeight = 9;
//     const padding = 6;

//     let currentY = startY;

//     // Function to render column headers
//     const renderHeaders = (startColumnIndex = 0) => {
//       let currentX = startX;
//       for (let i = startColumnIndex; i < tableColumn.length; i++) {
//         if (currentX + columnWidth > pageWidth) {
//           // If column exceeds page width, move to the next line
//           currentY += lineHeight;
//           currentX = startX;
//         }
//         doc.text(tableColumn[i], currentX + padding, currentY);
//         doc.rect(currentX, currentY - 4, columnWidth, lineHeight);
//         currentX += columnWidth;
//       }
//       currentY += lineHeight; // Move down for data rows
//     };

//     // Render headers initially
//     renderHeaders(1);

//     // Check if data is an array; if not, convert it to an array
//     const vehicleDataArray = Array.isArray(data) ? data : [data];

//     // Add table rows
//     vehicleDataArray.forEach((row) => {
//       const rowData = [
//         row.manufacturer || "N/A",
//         row.LocalAuthority || "N/A",
//         row.engineType || "N/A",
//         row.drivetrain || "N/A",
//         row.transmission || "N/A",
//         row.exteriorColor || "N/A",
//         row.interiorColor || "N/A",
//       ];

//       let currentX = startX;

//       rowData.forEach((cellData, index) => {
//         // Check if a new page is needed
//         if (currentY + lineHeight > pageHeight - 20) {
//           doc.addPage();
//           currentY = 20; // Reset Y for new page
//           renderHeaders(); // Render headers on the new page
//         }

//         // Wrap columns to a new line if exceeding page width
//         if (currentX + columnWidth > pageWidth) {
//           currentY += lineHeight;
//           currentX = startX;
//           renderHeaders(index); // Render headers for wrapped columns
//         }

//         // Print the data for each column
//         const cellText = doc.splitTextToSize(cellData, columnWidth - padding);
//         doc.text(cellText, currentX + padding, currentY);
//         doc.rect(
//           currentX,
//           currentY - 4,
//           columnWidth,
//           lineHeight * cellText.length
//         );

//         currentX += columnWidth;
//       });

//       // Move to the next row after each entry
//       currentY += lineHeight;
//     });

//     // Save the PDF
//     doc.save("Vehicle_Report.pdf");
//   };

//   if (!isMounted) return null;

//   return (
//     <>
//       <Header className="min-w-full" />
//       <div className="flex gap-4">
//         <Sidebar />
//         <div className="container mx-auto p-4 h-screen">
//           <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
//             <div className="flex justify-between m-2">
//               <button
//                 onClick={handleDownloadReport}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               >
//                 Download Report
//               </button>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="text-left px-4 py-2">Vehicle Name</th>
//                     <th className="text-left px-4 py-2">Registration Number</th>
//                     <th className="text-left px-4 py-2">
//                       Vehicle Local Authority
//                     </th>
//                     <th className="text-left px-4 py-2">Engine Type</th>
//                     <th className="text-left px-4 py-2">Drive Train</th>
//                     <th className="text-left px-4 py-2">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {data ? (
//                     <tr
//                       key={data._id}
//                       className={
//                         data._id % 2 === 0 ? "bg-gray-200" : "bg-white"
//                       }
//                     >
//                       <td className="text-left px-4 py-2">
//                         {data.model || "N/A"}
//                       </td>
//                       <td className="text-left px-4 py-2">
//                         {data.registrationNumber || "N/A"}
//                       </td>
//                       <td className="text-left px-4 py-2">
//                         {data.LocalAuthority || "N/A"}
//                       </td>
//                       <td className="text-left px-4 py-2">
//                         {data.engineType || "N/A"}
//                       </td>
//                       <td className="text-left px-4 py-2">
//                         {data.drivetrain || "N/A"}
//                       </td>
//                       <td className="text-left px-4 py-2">
//                         {data.isActive ? "Active" : "Inactive"}
//                       </td>
//                     </tr>
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center py-4">
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Page;




























"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { API_URL_Vehicle } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const router = useRouter();
  const id = params.VehicleRport;
  const [data, setData] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [router]);

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
  
    // Title and report metadata
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Report", 105, 10, { align: "center" });
  
    const reportDate = "12/26/2024";
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${reportDate}`, 14, 20);
  
    const vehicleName = "camry";
    const registrationNumber = "21";
    const companyName = "Encoderbytes";
  
    doc.text(`Vehicle Name: ${vehicleName}`, 14, 25);
    doc.text(`Registration No: ${registrationNumber}`, 14, 30);
    doc.text(`Company Name: ${companyName}`, 14, 35);
  
    // Define table headers
    const headers = [
      "Vehicle Name",
      "Registration No",
      "Vehicle Authority", // Updated header
      "Engine Type",
      "Drive Train",
      "Status",
    ];
  
    // Table dimensions
    const pageWidth = doc.internal.pageSize.width;
    const startX = 14;
    const startY = 45;
    const rowHeight = 10;
    const columnWidths = [30, 35, 40, 27, 27, 25]; // Adjusted widths
  
    let currentY = startY;
  
    // Render table headers
    doc.setFont("helvetica", "bold");
    headers.forEach((header, index) => {
      const x = startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.text(header, x + 2, currentY);
      doc.rect(x, currentY - 6, columnWidths[index], rowHeight);
    });
  
    currentY += rowHeight;
  
    // Render table rows
    const renderRow = (row) => {
      doc.setFont("helvetica", "normal");
      const rowData = [
        row.model || "N/A",
        row.registrationNumber || "N/A",
        row.LocalAuthority || "N/A", // Data remains the same
        row.engineType || "N/A",
        row.drivetrain || "N/A",
        row.isActive ? "Active" : "Inactive",
      ];
  
      rowData.forEach((cell, index) => {
        const x = startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
        const wrappedText = doc.splitTextToSize(cell, columnWidths[index] - 2);
        doc.text(wrappedText, x + 2, currentY);
        doc.rect(
          x,
          currentY - 6,
          columnWidths[index],
          rowHeight * wrappedText.length
        );
      });
  
      currentY += rowHeight;
  
      // Handle page break
      if (currentY + rowHeight > doc.internal.pageSize.height - 10) {
        doc.addPage();
        currentY = startY;
        // Re-render headers on new page
        headers.forEach((header, index) => {
          const x = startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
          doc.text(header, x + 2, currentY);
          doc.rect(x, currentY - 6, columnWidths[index], rowHeight);
        });
        currentY += rowHeight;
      }
    };
  
    if (Array.isArray(data)) {
      data.forEach(renderRow);
    } else {
      renderRow(data);
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
        <div className="container mx-auto p-4 h-screen">
          <div className="justify-between mx-auto items-center border-2 mt-3 w-full">
            <div className="flex justify-between m-2">
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
