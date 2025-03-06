"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";

import {
    API_URL_DriverMoreInfo,
    API_URL_DRIVERTOTAL
    // API_URL_DriverMoreupdate,
    // API_URL_CRONJOB
} from "../../../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import DeleteModal from "@/app/Dashboard/Components/DeleteModal";
import BackButton from "@/app/Dashboard/Components/BackButton";

import Addmakeapayment from "@/app/Dashboard/Driver/Addmakeapayment/Addmakeapayment"
import AddCost from "@/app/Dashboard/Driver/AddCost/AddCost"

const Page = ({ params }) => {
    const router = useRouter();
    const id = params.id;
    console.log(id);
    const [isMounted, setIsMounted] = useState(false);
    const [data, setData] = useState([]);
    const [totalAmount, settotalamount] = useState("");
    const [selectedCompanyName, setSelectedCompanyName] = useState("");
    // const [isOpenDriver, setIsOpenDriver] = useState(false);
    // const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemperpage, setitemperpage] = useState(30);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);
    const [isOpenPayment, setIsOpenPayment] = useState(false);
    const [isOpenAddCost, setIsOpenAddCost] = useState(false);


    const OpenPaymentModle = () => {
        setSelectedUserId(id);
        setIsOpenPayment(!isOpenPayment);
    };
    const OpenAddCostModle = () => {
        setSelectedUserId(id);
        setIsOpenAddCost(!isOpenAddCost);
    };

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

    // const formatDatee = (date) => {
    //   const month = String(date.getMonth() + 1).padStart(2, "0");
    //   const day = String(date.getDate()).padStart(2, "0");
    //   const year = date.getFullYear();
    //   return `${month}-${day}-${year}`;
    // };
    const fetchData = async () => {
        try {
            // Fetch the driver information from the API
            const response = await axios.get(`${API_URL_DriverMoreInfo}/${id}`);
            const drivertotal = await axios.get(`${API_URL_DRIVERTOTAL}`);
            const { data } = response;

            console.log("drivertotal", drivertotal);
            settotalamount(drivertotal.data)
            setData(data.result);
            // Check if there are results to process
            // if (data.result && data.result.length > 0) {

            //   // Iterate over each record in the result
            //   for (const record of data.result) {
            //     // Call drivercal for each record
            //     await drivercal(
            //       record.driverId, // Pass the driverId
            //       record.driverName, // Pass the driverName
            //       record.vehicle, // Pass the vehicle
            //       record.vehicleId, // Pass the vehicleId
            //       record.startDate, // Pass the original startDate
            //       record.paymentcycle, // Pass the payment cycle
            //       record.payment, // Pass the payment amount
            //       record.adminCompanyName // Pass the admin company name
            //     );
            //   }
            // } else {
            //   console.log("No data found for this driver");
            // }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
        }
    };




    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //     const res=  await axios.get(`${API_URL_CRONJOB}`);
    //       console.log("✅ Data updated successfully",res);
    //     } catch (error) {
    //       console.error("❌ Error updating data:", error);
    //     }
    //   };

    //   // Run every hour (3600000 ms)
    //   const interval = setInterval(fetchData, 3600000);
    //   // Run once on mount
    //   fetchData();

    //   return () => clearInterval(interval);
    // }, []);

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

    if (!isMounted) return null;
    // function formatDate(dateString) {
    //   const dateObject = new Date(dateString);
    //   return `${(dateObject.getMonth() + 1)
    //     .toString()
    //     .padStart(2, "0")}/${dateObject
    //       .getDate()
    //       .toString()
    //       .padStart(2, "0")}/${dateObject.getFullYear()}`;
    // }


    // Function to format date as MM/DD/YYYY
    function formatDate(dateString) {
        const dateObject = new Date(dateString);
        return `${(dateObject.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${dateObject
                .getDate()
                .toString()
                .padStart(2, "0")}/${dateObject.getFullYear()}`;
    }

    // Sorting function to arrange dates in ascending order
    // const sortedData = [...data].sort((a, b) => new Date(a.Dates) - new Date(b.Dates));

    const totalPages = Math.ceil(data.length / itemperpage);
    const currentData = data.slice(
        (currentPage - 1) * itemperpage,
        currentPage * itemperpage
    );

    // const sortedData = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // const sortedData = [...data].sort((a, b) => new Date(a.Dates) - new Date(b.Dates));

    // console.log("sortedData", sortedData);
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
                        Driver Balance
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
                                                        className="rounded-lg w-12 px-0 h-8 bg-[#E0E0E0] focus:outline-none"
                                                    >
                                                        <option disabled>0</option>
                                                        {Array.from({ length: 30 }, (_, i) => i + 1).map(
                                                            (number) => (
                                                                <option key={number} value={number}>
                                                                    {number}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                                {/* <div className="font-sans font-medium text-sm">
                                                        Entries
                                                    </div> */}
                                            </div>

                                            {/* <div className="flex justify-center">
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
                                                </div> */}
                                        </div>
                                        <div className="flex gap-2">
                                            {/* <button
                                                onClick={OpenAddCostModle}
                                                className="w-[156px] md:w-auto font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2"
                                            >
                                                Cost
                                            </button>
                                            <button
                                                onClick={OpenPaymentModle}
                                                className="w-[156px] md:w-auto font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2"
                                            >
                                                make a payment
                                            </button> */}
                                            <BackButton />
                                        </div>
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
                                                Driver Name
                                            </th>
                                            <th className="py-3 px-4 min-w-[150px] text-white bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                                                Payment Cycle
                                            </th>
                                            <th className="py-3 px-4 min-w-[150px] text-white  bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                                                Description
                                            </th>
                                            <th className="py-3 px-4 min-w-[150px] text-white  bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                                                Dates
                                            </th>
                                            <th className="py-3 px-4 min-w-[150px] text-white  bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                                                {/* Payment */}
                                                Debit
                                            </th>
                                            <th className="py-3 px-4 min-w-[150px] text-white  bg-custom-bg w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                                                {/* pay */}
                                                Credit
                                            </th>

                                            <th className="py-3 px-4 min-w-[180px] text-white  bg-custom-bg w-[180px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                                                Balance
                                            </th>

                                            {/* <th className="py-3 px-4 min-w-[180px] text-white  bg-custom-bg w-[180px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                                                Actions
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="font-sans font-medium text-sm">
                                        {currentData.length > 0 ? (
                                            [...currentData] // Create a copy to avoid modifying original array
                                                .filter(
                                                    (row) =>
                                                        row.adminCompanyName &&
                                                        row.adminCompanyName.toLowerCase() === selectedCompanyName.toLowerCase()
                                                )
                                                .filter((row) => row.startDate) // Remove rows with missing startDate
                                                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)) // Sort in ascending order
                                                .map((row) => (
                                                    <tr key={row._id} className="border-b text-center">
                                                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                                                            {row.driverName}
                                                        </td>

                                                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                                                            {row.paymentcycle}
                                                        </td>

                                                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                                                            {row.description}
                                                        </td>

                                                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                                                            {formatDate(row.startDate)}
                                                        </td>

                                                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                                                            {row.payment ? `£ ${row.payment}` : null}
                                                        </td>

                                                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                                                            {row.pay ? `£ ${row.pay}` : null}
                                                        </td>

                                                        <td className="py-3 px-4 whitespace-normal break-all overflow-hidden">
                                                            {row.totalamount}

                                                        </td>

                                                        {/* <td className="py-3 px-4 whitespace-normal break-all overflow-hidden text-center">
                                                            <button onClick={() => isopendeletemodel(row._id)}>
                                                                <img src="/trash.png" alt="delete" className="w-6" />
                                                            </button>
                                                        </td> */}
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="py-3 px-4 text-center text-gray-500">
                                                    No data available
                                                </td>
                                            </tr>
                                        )}

                                        {totalAmount && (
                                            <tr className="font-bold text-center">
                                                <td className="py-3 px-4">Total</td>
                                                <td className="py-3 px-4"></td>
                                                <td className="py-3 px-4"></td>
                                                <td className="py-3 px-4"></td>
                                                <td className="py-3 px-4">£ {totalAmount.totalPayment}</td>
                                                <td className="py-3 px-4">£ {totalAmount.totalPay}</td>
                                                <td className="py-3 px-4">{`Remain  £ ${totalAmount.remainingAmount}`}</td>
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
                            {/* pagination ends here */}
                        </div>
                    </div>
                </div>
            </div>
            <Addmakeapayment
                isOpen={isOpenPayment}
                onClose={OpenPaymentModle}
                fetchData={fetchData}
                Id={selectedUserId}
            />
            <AddCost
                isOpen={isOpenAddCost}
                onClose={OpenAddCostModle}
                fetchData={fetchData}
                Id={selectedUserId}
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