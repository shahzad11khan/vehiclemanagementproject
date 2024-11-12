"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import AddMoreInfoModal from "../AddMoreInfoModal/AddMoreInfoModal";
import {
  API_URL_DriverMoreInfo,
  // API_URL_DriverMoreupdate,
} from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";

const Page = ({ params }) => {
  const id = params.id;
  console.log(id);

  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [isOpenDriver, setIsOpenDriver] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      // Fetch the driver information from the API
      const response = await axios.get(`${API_URL_DriverMoreInfo}/${id}`);
      const { data } = response;

      console.log(data);

      // Check if there are results to process
      if (data.result && data.result.length > 0) {
        console.log("Fetched records:", data.result);
        setData(data.result);

        // Iterate over each record in the result
        for (const record of data.result) {
          // Call drivercal for each record
          await drivercal(
            record.driverId, // Pass the driverId
            record.driverName, // Pass the driverName
            record.vehicle, // Pass the vehicle
            record.startDate, // Pass the original startDate
            record.paymentcycle, // Pass the payment cycle
            record.payment, // Pass the payment amount
            record.adminCompanyName // Pass the admin company name
          );
        }
      } else {
        console.log("No data found for this driver");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  const formatDatee = (date) => {
    // Format the date to MM-DD-YYYY
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const drivercal = async (
    driverId,
    driverName,
    vehicle,
    startDate,
    paymentcycle,
    payment,
    adminCompanyName
  ) => {
    try {
      const passingDate = new Date(startDate); // Initialize passingDate to startDate
      const currentDate = new Date(); // Get the current date
      console.log(passingDate, currentDate);

      // Loop until passingDate is greater than or equal to currentDate
      while (formatDatee(passingDate) < formatDatee(currentDate)) {
        let shouldPostNewRecord = false; // Flag to check if a new record should be posted

        const value = paymentcycle.toLowerCase(); // Normalize the payment cycle value
        switch (value) {
          case "perday":
            shouldPostNewRecord = true; // Always post for daily cycle
            passingDate.setDate(passingDate.getDate() + 1); // Increment by 1 day
            break;

          case "perweek":
            if (
              Math.floor(
                (currentDate - passingDate) / (1000 * 60 * 60 * 24 * 7)
              ) > 0
            ) {
              shouldPostNewRecord = true; // Post if a week has passed
            }
            passingDate.setDate(passingDate.getDate() + 7); // Increment by 7 days
            break;

          case "permonth":
            if (
              passingDate.getMonth() !== currentDate.getMonth() ||
              passingDate.getFullYear() !== currentDate.getFullYear()
            ) {
              shouldPostNewRecord = true; // Post if a month has passed
            }
            passingDate.setMonth(passingDate.getMonth() + 1); // Increment by 1 month
            break;

          case "perquarter":
            const currentQuarter = Math.floor(currentDate.getMonth() / 3);
            const lastQuarter = Math.floor(passingDate.getMonth() / 3);
            if (
              currentQuarter !== lastQuarter ||
              passingDate.getFullYear() !== currentDate.getFullYear()
            ) {
              shouldPostNewRecord = true; // Post if a quarter has passed
            }
            passingDate.setMonth(passingDate.getMonth() + 3); // Increment by 3 months
            break;

          case "peryear":
            if (passingDate.getFullYear() !== currentDate.getFullYear()) {
              shouldPostNewRecord = true; // Post if a year has passed
            }
            passingDate.setFullYear(passingDate.getFullYear() + 1); // Increment by 1 year
            break;

          default:
            console.error("Invalid payment cycle value provided.");
            return;
        }

        // If a new record needs to be posted, update the database
        if (shouldPostNewRecord) {
          await updateDatabaseDate(
            driverId,
            driverName,
            vehicle,
            passingDate, // Use the newly calculated date
            paymentcycle,
            payment,
            adminCompanyName
          );
        }
      }
    } catch (error) {
      console.error("Failed to calculate and post driver data:", error);
      throw error;
    }
  };

  const updateDatabaseDate = async (
    IDD,
    driverName,
    vehicle,
    newStartDate, // This will be the new calculated date
    paymentCycle,
    payment,
    fetchedcompany
  ) => {
    try {
      const payload = {
        driverId: IDD,
        driverName: driverName,
        vehicle: vehicle,
        startDate: newStartDate, // Update with the new date
        paymentcycle: paymentCycle,
        payment: payment,
        endDate: "",
        totalamount: 0,
        totalToremain: 0,
        remaining: 0,
        adminCreatedBy: "",
        adminCompanyName: fetchedcompany,
      };

      console.log(payload);

      // Make the POST request to update the database
      const response = await axios.post(`${API_URL_DriverMoreInfo}`, payload);
      console.log("Record Added successfully:", response.data);
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  // Handle deletion of a title
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_DriverMoreInfo}/${id}`);
      const { success, message } = response.data;

      if (success) {
        toast.success(message);
        fetchData();
      } else {
        toast.warn(message);
      }
    } catch (error) {
      console.error("Error deleting title:", error);
      toast.error("Failed to delete title");
    }
  };

  // console.log(date, cycle);

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   // console.log(data);
  //   // console.log(selectedCompanyName);
  //   const filtered = data.filter((item) => {
  //     // console.log(item);
  //     const companyMatch =
  //       item.adminCompanyName &&
  //       selectedCompanyName &&
  //       item.adminCompanyName.toLowerCase() ===
  //         selectedCompanyName.toLowerCase();

  //     const usernameMatch =
  //       item.vehicle &&
  //       item.vehicle.toLowerCase().includes(searchTerm.toLowerCase());

  //     return companyMatch && usernameMatch; // Return true if both match
  //   });

  //   console.log(filtered);
  //   setFilteredData(filtered);
  // }, [searchTerm, data, selectedCompanyName]);

  // Toggle the title modal
  const OpenDriverModel = () => {
    setSelectedUserId(id);
    setIsOpenDriver(!isOpenDriver);
  };

  // Ensure client-side rendering only
  if (!isMounted) return null;

  // Calculate totals for calculation, subtractcalculation, and remaining

  const totalamount = data
    .filter(
      (row) =>
        row.adminCompanyName &&
        row.adminCompanyName.toLowerCase() === selectedCompanyName.toLowerCase()
    )
    .reduce((acc, row) => acc + row.payment, 0)
    .toFixed(2);
  const totalToremain = data
    .filter(
      (row) =>
        row.adminCompanyName &&
        row.adminCompanyName.toLowerCase() === selectedCompanyName.toLowerCase()
    )
    .reduce((acc, row) => acc + row.totalToremain, 0)
    .toFixed(2);
  const remaining = data
    .filter(
      (row) =>
        row.adminCompanyName &&
        row.adminCompanyName.toLowerCase() === selectedCompanyName.toLowerCase()
    )
    .reduce((acc, row) => acc + row.remaining, 0)
    .toFixed(2);

  // Function to update specific fields after a delay
  // const updateFieldsAfterDelay = async () => {
  //   // Get the values to be updated
  //   const totalCal = totalCalculation;
  //   const totalSubtractCal = totalSubtractCalculation;
  //   const totalRem = totalRemaining;

  //   // Create a new FormData object
  //   const formDataToSend = new FormData();

  //   // Set the specific fields you want to update
  //   formDataToSend.set("totalamount", totalCal);
  //   formDataToSend.set("totalsubtractamount", totalSubtractCal);
  //   formDataToSend.set("totalremainingamount", totalRem);

  //   setTimeout(async () => {
  //     console.log("Updating fields after a delay...");

  //     try {
  //       const res = await axios.put(
  //         `${API_URL_DriverMoreupdate}/${id}`, // Ensure 'id' is defined in scope
  //         formDataToSend,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       console.log("Update specific fields successful:", res.data);
  //     } catch (error) {
  //       console.error(
  //         "Error updating fields:",
  //         error.response ? error.response.data : error.message
  //       );
  //     }
  //   }, 3600000); // 60000 milliseconds = 1 minute
  // };

  // Call the function to initiate the update
  // updateFieldsAfterDelay();

  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    return `${(dateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObject
      .getDate()
      .toString()
      .padStart(2, "0")}/${dateObject.getFullYear()}`;
  }
  const totalPages = Math.ceil(data.length / recordsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className="container mx-auto p-4">
          <div className="justify-between items-center border-2 mt-3">
            <div className="flex justify-between">
              <button
                onClick={OpenDriverModel}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Driver Info
              </button>
            </div>

            {/* Responsive Table */}
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Vehicle
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        payment Cycle
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Dates
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Payment
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Submitted Date
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Submitted Payment
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Remaining Payment
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData
                        .filter(
                          (row) =>
                            row.adminCompanyName &&
                            row.adminCompanyName.toLowerCase() ===
                              selectedCompanyName.toLowerCase()
                        )
                        .map((row) => (
                          <tr key={row._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b border-gray-200">
                              {row.vehicle}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {row.paymentcycle}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {formatDate(row.startDate)}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              £ {row.payment}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {row.endDate === ""
                                ? ""
                                : formatDate(row.endDate)}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              £ {row.totalToremain}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              £ {row.remaining}
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
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-2 px-4 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                    {/* Total Row */}
                    {data.length > 0 && (
                      <tr className="font-bold">
                        <td className="py-2 px-4 border-b border-gray-200">
                          Total
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          £ {totalamount}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          £ {totalToremain}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          £ {remaining}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
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
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddMoreInfoModal
        isOpen={isOpenDriver}
        selectedUserId={selectedUserId}
        onClose={OpenDriverModel}
        fetchData={fetchData}
      />
    </>
  );
};

export default Page;
