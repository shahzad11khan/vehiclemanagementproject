"use client";
import React, { useState, useEffect, useCallback } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { MdCurrencyPound } from "react-icons/md";
import AddDriverModel from "../../../../Dashboard/Driver/AddDriver/AddDriverModel";
import UpdateDriverModel from "../../../../Dashboard/Driver/UpdateDriver/UpdateDriverModel";
import axios from "axios";
import { API_URL_Driver } from "../../../Components/ApiUrl/ApiUrls";
import {
  getCompanyName, getUserName
} from "@/utils/storageUtils"; import Link from "next/link";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import DeleteModal from "../../../Components/DeleteModal";

const Page = () => {
  const router = useRouter();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenDriver, setIsOpenDriver] = useState(false);
  const [isOpenDriverUpdate, setIsOpenDriverUpdate] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [router]);

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = (() => {
      const name1 = getCompanyName();
      if (name1) return name1;

      const name2 = getUserName();
      if (name2) return name2;
    })();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL_Driver}`);
      console.log(response)
      setDrivers(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching drivers.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isopendeletemodel = (id) => {
    setIsDeleteModalOpenId(id); // Set the ID of the item to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_Driver}/${id}`);
      const { data } = response;
      if (data?.success) {
        setDrivers((prevData) => prevData?.filter((item) => item._id !== id));
        // toast.success(data.message);
      } else {
        toast.warn(data?.message || "Failed to delete the driver.");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error(
        "An error occurred while deleting the driver. Please try again."
      );
    }
  };

  useEffect(() => {
    const filtered = drivers?.filter((driver) => {
      const companyMatch =
        driver?.adminCompanyName &&
        selectedCompanyName &&
        driver?.adminCompanyName.toLowerCase() ===
        selectedCompanyName.toLowerCase();
      const nameMatch =
        driver?.firstName &&
        searchTerm
          .toLowerCase()
          .split("")
          .every(
            (char) =>
              driver?.firstName?.toLowerCase().includes(char) || // Check in username
              driver?.email?.toLowerCase().includes(char)
          );
      return companyMatch && nameMatch;
    });
    console.log(filtered)
    setFilteredDrivers(filtered);
  }, [searchTerm, drivers, selectedCompanyName]);

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenDriverUpdate(true);
  };

  // console.log(handleEdit(id))
  if (!isMounted) return null;

  const OpenDriverModel = () => {
    setIsOpenDriver(!isOpenDriver);
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return `${(dateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObject
        .getDate()
        .toString()
        .padStart(2, "0")}/${dateObject.getFullYear()}`;
  };

  // Pagination calculations
  const indexOfLastDriver = currentPage * itemperpage;
  const indexOfFirstDriver = indexOfLastDriver - itemperpage;
  const currentDrivers = filteredDrivers?.slice(
    indexOfFirstDriver,
    indexOfLastDriver
  );

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredDrivers?.length / itemperpage);
  // const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1); // Create an array of page numbers

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
            All Drivers
          </h1>

          <div className="py-5">
            <div className="drop-shadow-custom4">
              {/* top section */}
              <div className="flex justify-between w-full py-2 px-2">
                <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">
                  <div className="flex justify-between gap-7 items-center">
                    <div className="md:flex gap-3 hidden items-center">
                      {" "}
                      {/* Key change: hidden md:flex */}
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

                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src="/search.svg"
                          className="absolute left-3 top-2"
                          alt="Search Icon"
                        />
                        <input
                          type="text"
                          placeholder="Search by email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* <BackButton /> */}
                    {/* <button
                      onClick={OpenDriverModel}
                      className="w-[132px] font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2 items-center justify-center"
                    >
                      <img src="/plus.svg" alt="Add Driver" />
                      Add Driver
                    </button> */}
                  </div>
                </div>
              </div>

              {/* top ends here  */}

              {/* table starts here  */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full bg-white border table-auto">
                  <thead className="font-sans font-bold text-sm text-left">
                    <tr className="text-white bg-[#38384A]">
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Name
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Email
                      </th>

                      {/* <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
          Home Telephone
        </th> */}
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Phone Number
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        License Number
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Ni Number
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Badge Type
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Date Of Birth
                      </th>
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Balance
                      </th>
                      <th className="py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans font-medium text-sm">
                    {currentDrivers?.map((driver) => (
                      <tr key={driver._id} className="border-b">
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                          {driver.firstName} {driver.lastName}
                        </td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                          {driver.email}
                        </td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                          {driver.tel1}
                        </td>
                        {/* <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
            {driver.tel2}
          </td> */}
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                          {driver.licenseNumber}
                        </td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                          {driver.niNumber}
                        </td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                          {driver.badgeType}
                        </td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                          {formatDate(driver.dateOfBirth)}
                        </td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">
                          {driver.totalamount}
                        </td>
                        <td className="py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] whitespace-normal break-all overflow-hidden text-center">
                          <div className="flex gap-4 justify-center">
                            <button onClick={() => handleEdit(driver._id)}>
                              <img src="/edit.png" alt="edit" className="w-6" />
                            </button>
                            <button
                              onClick={() => isopendeletemodel(driver._id)}
                            >
                              <img
                                src="/trash.png"
                                alt="delete"
                                className="w-6"
                              />
                            </button>
                            <button>
                              <Link
                                passHref
                                // Dashboard/Driver/CombineDriverAndVehicle/67c6d818b3dafda383ae3606
                                // Dashboard/Models/DriverBalance/GetDriverBalance/67c6d818b3dafda383ae3606
                                href={`/Dashboard/Models/DriverBalance/${driver._id}`}
                              >
                                <div className="flex items-center gap-3">
                                  <img src="/bcar.png" alt="info" />
                                </div>
                              </Link>
                            </button>
                          </div>
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
                        className={`h-8 px-2 border rounded-lg ${currentPage === 1
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
                                className={`h-8 w-8 border rounded-lg ${currentPage === page
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
                        className={`h-8 px-2 border rounded-lg ${currentPage === totalPages
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

      {/* Modals for Add and Update Drivers */}
      <AddDriverModel
        isOpen={isOpenDriver}
        onClose={OpenDriverModel}
        fetchData={fetchData}
      />
      <UpdateDriverModel
        isOpen={isOpenDriverUpdate}
        onClose={() => setIsOpenDriverUpdate(false)}
        selectedUserId={selectedUserId}
        fetchDataa={fetchData}
      />
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
