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

  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [isOpenDriver, setIsOpenDriver] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL_DriverMoreInfo}/${id}`);
      const { data } = response;

      if (data.Result && data.Result.length > 0) {
        setData(data.Result);
        console.log("Fetched records:", data.Result);

        for (const record of data.Result) {
          await drivercal(
            record.driverId,
            record.vehicle,
            record.startDate,
            record.paymentcycle,
            record.calculation,
            record.adminCompanyName
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const drivercal = async (
    IDD,
    vehicle,
    lastStartDate,
    cycle,
    initialPayment,
    fetchedcompany
  ) => {
    try {
      let payment = Number(initialPayment);
      const passingDate = new Date(lastStartDate);
      const currentDate = new Date();

      if (isNaN(passingDate.getTime())) {
        console.error("Invalid lastStartDate provided:", lastStartDate);
        return;
      }

      while (formatDatee(passingDate) < formatDatee(currentDate)) {
        let shouldPostNewRecord = false;

        const value = cycle.toLowerCase();
        switch (value) {
          case "perday":
            shouldPostNewRecord = true;
            payment += initialPayment;
            passingDate.setDate(passingDate.getDate() + 1);
            break;

          case "perweek":
            if (
              Math.floor(
                (currentDate - passingDate) / (1000 * 60 * 60 * 24 * 7)
              ) > 0
            ) {
              shouldPostNewRecord = true;
            }
            payment += initialPayment;
            passingDate.setDate(passingDate.getDate() + 7);
            break;

          case "permonth":
            if (
              passingDate.getMonth() !== currentDate.getMonth() ||
              passingDate.getFullYear() !== currentDate.getFullYear()
            ) {
              shouldPostNewRecord = true;
            }
            payment += initialPayment;
            passingDate.setMonth(passingDate.getMonth() + 1);
            break;

          case "perquarter":
            const currentQuarter = Math.floor(currentDate.getMonth() / 3);
            const lastQuarter = Math.floor(passingDate.getMonth() / 3);
            if (
              currentQuarter !== lastQuarter ||
              passingDate.getFullYear() !== currentDate.getFullYear()
            ) {
              shouldPostNewRecord = true;
            }
            payment += initialPayment;
            passingDate.setMonth(passingDate.getMonth() + 3);
            break;

          case "peryear":
            if (passingDate.getFullYear() !== currentDate.getFullYear()) {
              shouldPostNewRecord = true;
            }
            payment += initialPayment;
            passingDate.setFullYear(passingDate.getFullYear() + 1);
            break;

          default:
            console.error("Invalid payment cycle value provided.");
            return;
        }

        if (shouldPostNewRecord) {
          await updateDatabaseDate(
            IDD,
            vehicle,
            formatDatee(passingDate),
            cycle,
            payment,
            fetchedcompany
          );
        }
      }
    } catch (error) {
      console.error("Failed to calculate and post driver data:", error);
      throw error;
    }
  };

  // Function to update the date and payment in the database
  const updateDatabaseDate = async (
    IDD,
    vehicle,
    newStartDate,
    paymentCycle,
    payment,
    fetchedcompany
  ) => {
    console.log(
      "Updating record:",
      IDD,
      vehicle,
      newStartDate,
      paymentCycle,
      payment,
      fetchedcompany
    );
    try {
      const payload = {
        driverId: IDD,
        vehicle: vehicle,
        startDate: newStartDate, // Update with the new date
        paymentcycle: paymentCycle,
        calculation: payment,
        endDate: "",
        subtractcalculation: 0,
        totalamount: payment,
        totalsubtractamount: 0,
        totalremainingamount: 0,
        remaining: 0,
        adminCreatedBy: "",
        adminCompanyName: fetchedcompany,
      };

      const response = await axios.put(
        `${API_URL_DriverMoreInfo}/${IDD}`,
        payload
      );
      console.log("Record updated successfully:", response.data);
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

  const totalCalculation = data
    .filter(
      (row) =>
        row.adminCompanyName &&
        row.adminCompanyName.toLowerCase() === selectedCompanyName.toLowerCase()
    )
    .reduce((acc, row) => acc + row.calculation, 0)
    .toFixed(2);
  const totalSubtractCalculation = data
    .filter(
      (row) =>
        row.adminCompanyName &&
        row.adminCompanyName.toLowerCase() === selectedCompanyName.toLowerCase()
    )
    .reduce((acc, row) => acc + row.subtractcalculation, 0)
    .toFixed(2);
  const totalRemaining = data
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
                    {data.length > 0 ? (
                      data
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
                              £ {row.calculation}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {row.endDate === ""
                                ? ""
                                : formatDate(row.endDate)}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              £ {row.subtractcalculation}
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
                          £ {totalCalculation}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          £ {totalSubtractCalculation}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          £ {totalRemaining}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                        <td className="py-2 px-4 border-b border-gray-200"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
