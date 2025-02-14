"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import GenerateStatementModal from "../GenerateStatementModal/GenerateStatement";

const Page = () => {
    const columns = [
        { name: "Name", accessor: "name" },
        { name: "Driver ID", accessor: "driverId" },
        { name: "Description", accessor: "description" },
        { name: "Payment", accessor: "payment" },
        { name: "Debit", accessor: "debit" },
        { name: "Credit", accessor: "credit" },
        { name: "Balance", accessor: "balance" },
        { name: "Transaction Date", accessor: "transactionDate" },
    ];

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemperpage = 5

    useEffect(() => {
        setIsMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        const dummyData = [
            {
                name: "John Doe",
                driverId: "D123",
                description: "Payment for service",
                payment: "$100",
                debit: "$50",
                credit: "$50",
                balance: "$200",
                transactionDate: "2025-02-14",
            },
            {
                name: "John Doe",
                driverId: "D123",
                description: "Payment for service",
                payment: "$100",
                debit: "$50",
                credit: "$50",
                balance: "$200",
                transactionDate: "2025-02-14",
            },
            {
                name: "John Doe",
                driverId: "D123",
                description: "Payment for service",
                payment: "$100",
                debit: "$50",
                credit: "$50",
                balance: "$200",
                transactionDate: "2025-02-14",
            },
            {
                name: "John Doe",
                driverId: "D123",
                description: "Payment for service",
                payment: "$100",
                debit: "$50",
                credit: "$50",
                balance: "$200",
                transactionDate: "2025-02-14",
            },
            {
                name: "John Doe",
                driverId: "D123",
                description: "Payment for service",
                payment: "$100",
                debit: "$50",
                credit: "$50",
                balance: "$200",
                transactionDate: "2025-02-14",
            },

        ];
        setData(dummyData);
        setFilteredData(dummyData);
    };

    useEffect(() => {
        const filtered = data.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    if (!isMounted) {
        return null;
    }

    const totalPages = Math.ceil(filteredData.length / itemperpage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemperpage,
        currentPage * itemperpage
    );

    return (
        <div className="h-[100vh] overflow-hidden">
            <Header className="min-w-full" />
            <div className="flex gap-4">
                <Sidebar />
                <div className="w-[80%] xl:w-[85%] min-h-screen">
                    <div
                        className="justify-between mx-auto items-center w-full overflow-y-auto pr-4"
                        style={{ height: "calc(100vh - 90px)" }}
                    >
                        <h1 className="text-[#313342] font-medium text-2xl py-5 pb-8  flex gap-2 items-center">
                            <div className="myborder flex gap-3 border-2 border-t-0 border-l-0 border-r-0">
                                {/* <span className="opacity-65">Setting</span> */}
                                <div className="flex items-center gap-3 myborder2">
                                    {/* <span><img src="/setting_arrow.svg" className="w-2 h-4 object-cover object-center  "></img></span> */}
                                    <span>My Balance</span>
                                </div>
                            </div>
                        </h1>

                        <div className="w-full py-5">
                            <div>

                                <div className="flex justify-between w-full py-2 px-2">
                                    <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">
                                        <div className="flex justify-between gap-7 items-center">
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
                                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                                                            <option key={number} value={number}>
                                                                {number}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="font-sans font-medium text-sm">Entries</div>
                                            </div>

                                            <div className="flex justify-center">
                                                <div className="relative">
                                                    <img src="/search.svg" className="absolute left-3 top-2" alt="Search Icon" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search by Manufacturer"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className=" w-[230px] md:w-[260px]  border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setIsReportModalOpen(true)}
                                            className="w-[156px] md:w-auto font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2"
                                        >
                                            <img src="/plus.svg" alt="Add Company" className="" />
                                            Generate Report
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                                    <table className="w-full bg-white border table-fixed">
                                        <thead className=" font-bold text-sm text-left">
                                            <tr className="text-white bg-[#38384A]">
                                                {columns.map((column) => (
                                                    <th
                                                        key={column.name}
                                                        className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden"
                                                    >
                                                        {column.name}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="font-sans font-medium text-sm">
                                            {currentData.map((row, index) => (
                                                <tr key={index} className="border-b text-center">
                                                    {columns.map((column) => (
                                                        <td
                                                            key={column.name}
                                                            className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden"
                                                        >
                                                            {row[column.accessor] || "-"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* <div className="flex justify-center py-5 font-montserrat font-medium text-[12px]">
                                    <nav>
                                        <ul className="flex items-center gap-3">
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

                                            {totalPages > 1 &&
                                                Array.from({ length: totalPages }, (_, index) => (
                                                    <li key={index + 1}>
                                                        <button
                                                            onClick={() => setCurrentPage(index + 1)}
                                                            className={`h-8 w-8 border rounded-lg ${currentPage === index + 1
                                                                ? "bg-custom-bg text-white"
                                                                : "bg-white"
                                                                }`}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    </li>
                                                ))}

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
                                </div> */}
                                <div className="flex justify-center py-5 font-montserrat font-medium text-[12px]">
                                    <nav>
                                        <ul className="flex items-center gap-3">
                                            {/* Previous Button */}
                                            <li>
                                                <button
                                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className={`h-8 px-2 border rounded-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-white"
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
                                                        Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                                            <li key={page}>
                                                                <button
                                                                    onClick={() => setCurrentPage(page)}
                                                                    className={`h-8 w-8 border rounded-lg ${currentPage === page ? "bg-custom-bg text-white" : "bg-white"
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
                                                                        <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">1</button>
                                                                    </li>
                                                                    <li><span className="px-2">...</span></li>
                                                                    <li>
                                                                        <button onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 border rounded-lg bg-white">
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
                                                                    <li><span className="px-2">...</span></li>
                                                                    <li>
                                                                        <button onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 border rounded-lg bg-white">
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
                                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className={`h-8 px-2 border rounded-lg ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "bg-white"
                                                        }`}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GenerateStatementModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
};

export default Page;