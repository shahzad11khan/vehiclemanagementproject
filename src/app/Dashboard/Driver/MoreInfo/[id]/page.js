"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
// import AddMoreInfoModal from "../AddMoreInfoModal/AddMoreInfoModal";
import {
  API_URL_DriverMoreInfo,
  // API_URL_DriverMoreupdate,
} from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import DeleteModal from "@/app/Dashboard/Components/DeleteModal";
import BackButton from "@/app/Dashboard/Components/BackButton";

const Page = ({ params }) => {
  const router = useRouter();
  const id = params.id;
  console.log(id);
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  // const [isOpenDriver, setIsOpenDriver] = useState(false);
  // const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);

  const isopendeletemodel = (id) => {
    setIsDeleteModalOpenId(id); // Set the ID of the item to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [router]);
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
            record.vehicleId, // Pass the vehicleId
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
    vehicleId,
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
            vehicleId,
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
    vehicleId,
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
        vehicle: vehicleId,
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
  // const OpenDriverModel = () => {
  //   setSelectedUserId(id);
  //   setIsOpenDriver(!isOpenDriver);
  // };

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
  const totalPages = Math.ceil(data.length / itemperpage);
  const currentData = data.slice(
    (currentPage - 1) * itemperpage,
    currentPage * itemperpage
  );

  return (
    <div className="h-[100vh] overflow-hidden">
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div
          className="w-[80%] xl:w-[85%] h-screen flex flex-col justify-start overflow-y-auto pr-4"
          style={{
            height: "calc(100vh - 90px)",
          }}
        >
          <h1 className="text-[#313342] font-medium text-2xl py-5 underline decoration-[#AEADEB] underline-offset-8">
            Driver Info
          </h1>
          <div className="py-5">
            <div className="drop-shadow-custom4">
              {/* top section starts here */}
              <div className="flex justify-between w-full py-2 px-2">
                <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">
                  <div className="w-full flex justify-between flex-wrap gap-4">
                  <div className=" flex gap-7 items-center">
                    <div className="md:flex gap-3 hidden items-center">
                      <div className="font-sans font-medium text-sm">Show</div>
                      <div>
                        <select
                          value={itemperpage}
                          onChange={(e) => {
                            setitemperpage(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="rounded-lg w-12 px-1 h-8 bg-[#E0E0E0] focus:outline-none"
                        >
                          <option disabled>0</option>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
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
                          // value={searchTerm}
                          // onChange={(e) => setSearchTerm(e.target.value)}
                          className="border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                      </div>
                    </div>
                    </div>
                    <BackButton/>
                  </div>
                </div>
              </div>

              {/* top section ends here */}

              {/* Responsive Table */}

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border table-auto">
                  <thead className="font-sans font-bold text-sm text-left bg-[#38384A]">
                    <tr className="text-white ">
                      <th className="py-3 px-4 min-w-[150px] text-white bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                        Vehicle
                      </th>
                      <th className="py-3 px-4 min-w-[150px] text-white bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                        Payment Cycle
                      </th>
                      <th className="py-3 px-4 min-w-[150px] text-white  bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                        Dates
                      </th>
                      <th className="py-3 px-4 min-w-[150px] text-white  bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                        Payment
                      </th>
                      <th className="py-3 px-4 min-w-[150px] text-white bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                        Submitted Date
                      </th>
                      <th className="py-3 px-4 min-w-[170px] text-white bg-custom-bg w-[170px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                        Submitted Payment
                      </th>
                      <th className="py-3 px-4 min-w-[168px] text-white  bg-custom-bg w-[168px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                        Remaining Payment
                      </th>
                      <th className="py-3 px-4 min-w-[180px] text-white  bg-custom-bg w-[180px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans font-medium text-sm">
                    {currentData.length > 0 ? (
                      currentData
                        .filter(
                          (row) =>
                            row.adminCompanyName &&
                            row.adminCompanyName.toLowerCase() ===
                              selectedCompanyName.toLowerCase()
                        )
                        .map((row) => (
                          <tr key={row._id} className="border-b text-center">
                            <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                              {row.vehicle}
                            </td>
                            <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                              {row.paymentcycle}
                            </td>
                            <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                              {formatDate(row.startDate)}
                            </td>
                            <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                              £ {row.payment}
                            </td>
                            <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                              {row.endDate === ""
                                ? ""
                                : formatDate(row.endDate)}
                            </td>
                            <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                              £ {row.totalToremain}
                            </td>
                            <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                              £ {row.remaining}
                            </td>
                            <td className="py-3 px-4 whitespace-normal break-all overflow-hidden text-center">
                              <button
                                onClick={() => isopendeletemodel(row._id)}
                              >
                                <img
                                  src="/trash.png"
                                  alt="delete"
                                  className="w-6"
                                />
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="py-3 px-4 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                    {data.length > 0 && (
                      <tr className="font-bold text-center">
                        <td className="py-3 px-4">Total</td>
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4">£ {totalamount}</td>
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4">£ {totalToremain}</td>
                        <td className="py-3 px-4">£ {remaining}</td>
                        <td className="py-3 px-4"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* pagination starts here */}
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
              {/* pagination ends here */}
            </div>
          </div>
        </div>
      </div>
      {/* <AddMoreInfoModal
        isOpen={isOpenDriver}
        selectedUserId={selectedUserId}
        onClose={OpenDriverModel}
        fetchData={fetchData}
      /> */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        Id={isDeleteModalOpenId}
      />
    </div>
  );
};

export default Page;
