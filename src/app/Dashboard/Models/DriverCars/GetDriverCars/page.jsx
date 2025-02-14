"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "@/app/Dashboard/Components/DeleteModal";

const Page = () => {
    const columns = [
        { name: "Manufacturer", accessor: "manufacturer" },
        { name: "Model", accessor: "model" },
        { name: "Year", accessor: "year" },
        { name: "Type", accessor: "type" },
        { name: "Engine Type", accessor: "engineType" },
        { name: "Company", accessor: "company" },
        { name: "Status", accessor: (row) => (row.isActive ? "Active" : "Inactive") },
    ];

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);
    const [isDamageReportModalOpen, setIsDamageReportModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemperpage, setitemperpage] = useState(5);

    useEffect(() => {
        setIsMounted(true);
        fetchDummyData();
    }, []);

    const fetchDummyData = () => {
        const dummyData = [
            {
                _id: "1",
                manufacturer: "Toyota",
                model: "Corolla",
                year: "2020",
                type: "Sedan",
                engineType: "Petrol",
                company: "ABC Motors",
                isActive: true,
            },
            {
                _id: "2",
                manufacturer: "Honda",
                model: "Civic",
                year: "2019",
                type: "Coupe",
                engineType: "Diesel",
                company: "XYZ Auto",
                isActive: false,
            },
            {
                _id: "3",
                manufacturer: "Ford",
                model: "Mustang",
                year: "2021",
                type: "Sports",
                engineType: "Electric",
                company: "LMN Cars",
                isActive: true,
            },
            {
                _id: "4",
                manufacturer: "BMW",
                model: "X5",
                year: "2022",
                type: "SUV",
                engineType: "Hybrid",
                company: "PQR Autos",
                isActive: true,
            },
            {
                _id: "5",
                manufacturer: "Audi",
                model: "A4",
                year: "2018",
                type: "Sedan",
                engineType: "Petrol",
                company: "DEF Motors",
                isActive: false,
            },
        ];
        setData(dummyData);
        setFilteredData(dummyData);
    };

    useEffect(() => {
        const filtered = data?.filter((item) => {
            return (
                item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const isopendeletemodel = (id) => {
        setIsDeleteModalOpenId(id);
        setIsDeleteModalOpen(true);
    };

    console.log(isopendeletemodel)

    const handleDamageReport = () => {
        setIsDamageReportModalOpen(true);
    };

    const handleDropdownAction = (action, id) => {
        const actionMapping = {
            "Car Details": `/car-details/${id}`,
            "Maintenance Report": `/maintenance-report/${id}`,
            "MOT Report": `/mot-report/${id}`,
            "Service Report": `/service-report/${id}`,
            "Road Tax Report": `/road-tax-report/${id}`,
        };
        window.location.href = actionMapping[action];
    };

    if (!isMounted) {
        return null;
    }

    const totalPages = Math.ceil(filteredData?.length / itemperpage);
    console.log(totalPages)
    const currentData = filteredData?.slice(
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
                        <h1 className="text-[#313342] font-medium text-2xl py-5 pb-2  flex gap-2 items-center">
                            <div className="myborder flex gap-3 border-2 border-t-0 border-l-0 border-r-0">
                                {/* <span className="opacity-65">Setting</span> */}
                                <div className="flex items-center gap-3 myborder2">
                                    {/* <span><img src="/setting_arrow.svg" className="w-2 h-4 object-cover object-center  "></img></span> */}
                                    <span>My Cars</span>
                                </div>
                            </div>
                        </h1>

                        <div className="w-full py-5">
                            <div className="drop-shadow-custom4">
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
                                    </div>
                                </div>

                                <div className="">
                                    <table className="w-full bg-white border">
                                        <thead className="font-sans font-bold text-sm text-left">
                                            <tr className="text-white bg-[#38384A]">
                                                {columns.map((column) => (
                                                    <th
                                                        key={column.name}
                                                        className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden"
                                                    >
                                                        {column.name}
                                                    </th>
                                                ))}
                                                <th className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-sans font-medium text-sm">
                                            {currentData?.map((row) => (
                                                <tr key={row._id} className="border-b text-center">
                                                    {columns.map((column) => (
                                                        <td
                                                            key={column.name}
                                                            className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden"
                                                        >
                                                            {typeof column.accessor === "function"
                                                                ? column.accessor(row)
                                                                : row[column.accessor]}
                                                        </td>
                                                    ))}
                                                    <td className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all">
                                                        <div className="flex gap-2 justify-center">
                                                            <button onClick={() => handleDamageReport(row._id)}>
                                                                <img src="/damagecar.svg" alt="D" className="w-6" />
                                                            </button>
                                                            <div className="relative group">
                                                                <button>
                                                                    <img src="/reporticon.svg" alt="Dropdown Actions" className="w-6" />
                                                                </button>
                                                                <div className="absolute -left-20 text-[8px] hidden group-hover:block bg-white  shadow-xl rounded-lg z-50">
                                                                    {[
                                                                        "Car Details",
                                                                        "Maintenance Report",
                                                                        "MOT Report",
                                                                        "Service Report",
                                                                        "Road Tax Report",
                                                                    ].map((action) => (
                                                                        <div
                                                                            key={action}
                                                                            onClick={() => handleDropdownAction(action, row._id)}
                                                                            className="w-[107px] rounded hover:bg-[#313342C9] hover:text-white cursor-pointer"
                                                                        >
                                                                            {action}
                                                                            <hr />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={() => handleDelete(isDeleteModalOpenId)}
                Id={isDeleteModalOpenId}
            />

            {isDamageReportModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-12 w-[90%] max-w-[700px]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Report Damage</h2>
                            <img
                                src="/crossIcon.svg"
                                className="cursor-pointer"
                                alt="Close"
                                onClick={() => setIsDamageReportModalOpen(false)}
                            />
                        </div>
                        <form>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="mb-3">
                                    <label className="text-[10px]">Manufacturer</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="text-[10px]">Model</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="text-[10px]">Year</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-[10px]">Damage Description</label>
                                <textarea
                                    className="mt-1 block w-full p-2 border border-[#42506666] rounded shadow"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="text-[10px]">Vehicle Images</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        id="useravatar"
                                        name="useravatar"
                                        accept="image/*"
                                        // onChange={handleFileChange}
                                        className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                                    />

                                    <input
                                        type="file"
                                        id="useravatar"
                                        name="useravatar"
                                        accept="image/*"
                                        // onChange={handleFileChange}
                                        className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                                    />

                                    <input
                                        type="file"
                                        id="useravatar"
                                        name="useravatar"
                                        accept="image/*"
                                        // onChange={handleFileChange}
                                        className="mt-1 block w-48 text-[8px] text-gray-400 file:mr-4 file:py-1 p-2 file:px-4 file:rounded-lg file:border file:text-[10px] file:font-semibold file:bg-white hover:file:bg-blue-100 border border-[#0885864D] rounded-[10px] border-dashed "
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-[10px] mt-10">
                                <button
                                    type="button"
                                    onClick={() => setIsDamageReportModalOpen(false)}
                                    className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;