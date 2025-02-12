"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import Header from "../Components/Header.js";
import Sidebar from "../Components/Sidebar.js";
import { useRouter } from "next/navigation";

import HeroSection from "../Components/HeroSection";
import { getAuthData, isAuthenticated } from "@/utils/verifytoken";
import { GetVehicle } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas.js";
import {
  API_URL_VehicleMOT,
  API_URL_VehicleService,
  API_URL_VehicleRoadTex,
} from "../Components/ApiUrl/ApiUrls";
import { getCompanyName, getUserName, getUserRole } from "@/utils/storageUtils";
import axios from "axios";
import Link from "next/link.js";
// import { Doughnut } from "react-chartjs-2";

import AdminDashBDoughnut from "../Components/AdminDashBDoughnut.jsx";
import { GetCompany } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
// import { totalmem } from "node:os";

const Page = () => {
  const router = useRouter();
  const [superadmin, setsuperadmin] = useState("");
  const [companyname, setcompnayname] = useState("");

  const [TotalCar, setTotalcar] = useState(0);
  const [activeCars, setactiveCars] = useState([]);
  const [inactiveCars, setinactiveCars] = useState([]);
  const [standby, setstandby] = useState(0);
  const [sellCar, setSellcar] = useState(0);
  const [rent, setRentcar] = useState(0);
  const [maintenance, setMaintenance] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  const [activeCompanies, setactiveCompanies] = useState(0);
  const [inactiveCompanies, setinativeCompanies] = useState(0);
  const [flag, setflag] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");


  console.log("Total Cars",TotalCar)

  useEffect(() => {
    const indexOfLastUser = currentPage * itemperpage;
    const indexOfFirstUser = indexOfLastUser - itemperpage;
    const users = filteredData.slice(indexOfFirstUser, indexOfLastUser);
    setCurrentData(users); // Update currentUsers state
    setTotalPages(Math.ceil(filteredData.length / itemperpage)); // Update totalPages state
  }, [filteredData, currentPage, itemperpage,activeTab]);
  

  // Click handler to change tabs
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  console.log(filteredData, handleTabClick)

  const fetchMOT = async () => {
    try {
      const response = await axios.get(`${API_URL_VehicleMOT}`);
      console.log("MOT Data: ", response.data.Result);
      const filteredData = processData(response.data.Result, "motDueDate");
      setData(filteredData);
      // setFilteredData(filteredData);
    } catch (error) {
      console.error("Error fetching MOT data:", error);
    }
  };

  const fetchService = async () => {
    try {
      const response = await axios.get(`${API_URL_VehicleService}`);
      console.log("Service Data: ", response.data.Result);
      const filteredData = processData(response.data.Result, "serviceDueDate");
      setData(filteredData);
      setFilteredData(filteredData);
    } catch (error) {
      console.error("Error fetching Service data:", error);
    }
  };

  const fetchRoadtax = async () => {
    try {
      const response = await axios.get(`${API_URL_VehicleRoadTex}`);
      console.log("RoadTax Data: ", response.data.Result);
      const filteredData = processData(response.data.Result, "roadtexDueDate");
      setData(filteredData);
      setFilteredData(filteredData);
    } catch (error) {
      console.error("Error fetching Road Tax data:", error);
    }
  };

  const processData = (data, dueDateKey) => {
    return data.map((row) => {
      const dueDate = new Date(row[dueDateKey]);
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set current time to midnight
      currentDate.setDate(currentDate.getDate() + 1); // Add 1 day (to make it "tomorrow")

      dueDate.setHours(0, 0, 0, 0); // Set due date time to midnight

      const dueDateParts = dueDate.toISOString().split("T")[0];
      const currentDateParts = currentDate.toISOString().split("T")[0];

      // Calculate the difference in days
      const diffInDays = Math.floor(
        (new Date(dueDateParts) - new Date(currentDateParts)) /
          (1000 * 60 * 60 * 24)
      );

      let daysLeft;
      let status;
      let daysExpired = 1;

      if (diffInDays > 0) {
        daysLeft = diffInDays;
        status = "Active";
      } else {
        daysExpired = Math.abs(diffInDays);
        status = "Expired";
      }

      // Add the logic to show "daysExpired" if it's greater than 60 days
      if (daysLeft && daysLeft < 60) {
        return {
          ...row,
          dueDate: dueDateParts,
          currentDateParts,
          daysLeft, // Show number of days left if less than 60
          status,
        };
      } else if (daysExpired && daysExpired > 60) {
        return {
          ...row,
          dueDate: dueDateParts,
          currentDateParts,
          daysExpired, // Show number of days expired if greater than 60
          status,
        };
      }

      return {
        ...row,
        dueDate: dueDateParts,
        currentDateParts,
        status,
      };
    });
  };

  const fetchAllData = async () => {
    try {
      const [motResponse, serviceResponse, roadtaxResponse] = await Promise.all(
        [
          axios.get(API_URL_VehicleMOT),
          axios.get(API_URL_VehicleService),
          axios.get(API_URL_VehicleRoadTex),
        ]
      );

      const combinedData = [
        ...motResponse.data.Result,
        ...serviceResponse.data.Result,
        ...roadtaxResponse.data.Result,
      ];
      console.log("All",combinedData)
      setData(combinedData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect to fetch data based on active tab
  useEffect(() => {
    if (activeTab === "RoadTax") {
      fetchRoadtax();
    } else if (activeTab === "Service") {
      fetchService();
    } else if (activeTab === "MOT") {
      fetchMOT();
    } else if (activeTab === "ALL") {
      fetchAllData();
    }
  }, [activeTab]);
  // const getPath = () => {
  //   switch (activeTab) {
  //     case "Service":
  //       return `/Dashboard/Vehicle/AddServiceReport/`;
  //     case "RoadTax":
  //       return `/Dashboard/Vehicle/AddRoadTaxReport/`;
  //     case "MOT":
  //     default:
  //       return `/Dashboard/Vehicle/AddMOTReport/`;
  //   }
  // };
  useEffect(() => {
    const companyName = getCompanyName();
    const companyuser = getUserName();
    const userrole = getUserRole();
    console.log(data);
    const filtered = data.filter((item) => {
      console.log(item);

      // Check for undefined values in properties before comparing
      if (companyuser && userrole === "user") {
        if (item.adminCompanyName && item.asignto) {
          return (
            item.adminCompanyName.toLowerCase() === companyName.toLowerCase() &&
            item.asignto.toLowerCase() === companyuser.toLowerCase()
          );
        }
      } else {
        if (userrole === "superadmin") {
          return data;
        }
        if (item.adminCompanyName) {
          return (
            item.adminCompanyName.toLowerCase() === companyName.toLowerCase()
          );
        }
      }

      return false; // Default return if none of the conditions are met
    });

    setFilteredData(filtered);
    // console.log(filtered);
  }, [data]);

  useEffect(() => {
    if (isAuthenticated()) {
      const authData = getAuthData();
      setsuperadmin(authData.role);
      setflag(authData.flag);
      setcompnayname(authData.companyName);
    } else {
      router.push("/");
    }
  }, [router]);

  Chart.register(...registerables);

  const fetchCounts = useCallback(async () => {
    try {
      const vehicleData = await GetVehicle();
      const { count, result } = vehicleData;
      console.log("Cars",vehicleData);
      //getting active cars
      const ActiveCars = result.filter((cars) => cars.isActive);
      setactiveCars(ActiveCars);
      //getting inactive cars
      const InActiveCars = result.filter((cars) => !cars.isActive);
      setinactiveCars(InActiveCars);
      // console.log(count, result);

      setTotalcar((prev) => (prev !== count ? count : prev));

      if (!result || result.length === 0) {
        setstandby((prev) => (prev !== 0 ? 0 : prev));
        setSellcar((prev) => (prev !== 0 ? 0 : prev));
        setRentcar((prev) => (prev !== 0 ? 0 : prev));
        setMaintenance((prev) => (prev !== 0 ? 0 : prev));
        return;
      }
      // Encoderbytes1! shahzad@t@26offf
      let standbyCar = 0;
      let sellCar = 0;
      let rentCar = 0;
      let maintenance = 0;

      result.forEach((vehicle) => {
        // console.log(companyname);
        if (vehicle.adminCompanyName === companyname) {
          // console.log(vehicle);
          switch (vehicle.vehicleStatus) {
            case "Standby":
              standbyCar++;
              break;
            case "Sale":
              sellCar++;
              break;
            case "Rent":
              rentCar++;
              break;
            case "Maintenance":
              maintenance++;
              break;
          }
        }
      });

      setstandby((prev) => (prev !== standbyCar ? standbyCar : prev));
      setSellcar((prev) => (prev !== sellCar ? sellCar : prev));
      setRentcar((prev) => (prev !== rentCar ? rentCar : prev));
      setMaintenance((prev) => (prev !== maintenance ? maintenance : prev));
    } catch (error) {
      console.error(`Failed to fetch data: ${error}`);
    }
  }, [companyname, superadmin]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, router]);

  // getting companies
  const fetchData = async () => {
    try {
      const { result } = await GetCompany();
      const ActiveCompanies = result.filter(
        (company) => company.isActive
      ).length;
      const InactiveCompanies = result.length - ActiveCompanies;
      setactiveCompanies(ActiveCompanies);
      setinativeCompanies(InactiveCompanies);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // by ali
  const companiesData = {
    labels: ["Inactive", "Active"],
    datasets: [
      {
        label: "Companies Status",
        data: [inactiveCompanies, activeCompanies],
        backgroundColor: ["#404CA0", "#27273AEB"],
        borderWidth: 1,
      },
    ],
  };
  const carsData = {
    labels: ["Inactive", "Active"],
    datasets: [
      {
        label: "Cars Status",
        data: [inactiveCars.length, activeCars.length],
        backgroundColor: ["#404CA0", "#27273AEB"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
    },
  };

  return (
    <>
      <Header className="min-w-full" />
      <div
        className="flex gap-4 overflow-hidden"
        style={{ height: "calc(100vh - 76px)" }}
      >
        <Sidebar />
        {/* ali */}
        {superadmin === "superadmin" && flag === "false" ? (
          <div className=" mt-5 overflow-auto w-[80%] xl:w-[85%]">
            <h1 className="text-[#313342] font-medium text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8">
              Dashboard
            </h1>
            <div className="flex w-full gap-5 flex-wrap">
              <AdminDashBDoughnut
                link={"/Dashboard/Company/AllCompanies"}
                title="Companies"
                data={companiesData}
                option={options}
              ></AdminDashBDoughnut>
              <AdminDashBDoughnut
                title="Cars"
                data={carsData}
                option={options}
              ></AdminDashBDoughnut>
            </div>
          </div>
        ) : (
          <main className=" mt-5 overflow-auto w-[80%] xl:w-[85%]">
            <div className="w-full pr-4 flex flex-col gap-8">
              <HeroSection TotalCar={TotalCar} carsOnRent={rent} />
              <section className="flex flex-wrap min-w-full  gap-10 text-center rounded-xl">
                {/* box1 */}
                <div className="w-[268px] h-[132px] drop-shadow-custom3 rounded-xl">
                  <div className="flex justify-between px-3 pt-4">
                    <div className="font-medium text-base font-sans">
                      Total Cars
                    </div>
                    <div className="bg-[#DC4E8C] rounded-md h-[41px] w-[41px] flex justify-center text-center">
                      <div className="flex bg-transparent flex-col justify-center items-center">
                        <img src="/vehicle.png" alt="vehicle" className="w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="border-l-4 border-[#DC4E8C] h-12"></div>
                    <h2 className="text-left px-2 font-bold text-[40px]">
                      {superadmin === "superadmin" && flag === "false" ? (
                        <span className="text-[#DC4E8C]">
                          {TotalCar < 10 ? "0" + TotalCar : TotalCar}
                        </span> // Corrected
                      ) : superadmin === "superadmin" && flag === "true" ? (
                        <span className="text-[#DC4E8C]">
                          {TotalCar < 10 ? "0" + TotalCar : TotalCar}
                        </span>
                      ) : (
                        <span className="text-[#DC4E8C]">
                          {TotalCar < 10 ? "0" + TotalCar : TotalCar}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* box1 ends */}

                {/* box 2 */}
                <div className="w-[268px] h-[132px] drop-shadow-custom3 rounded-xl">
                  <div className="flex justify-between px-3 pt-4">
                    <div className="font-medium text-base font-sans">
                      Cars for Rent
                    </div>
                    <div className="bg-[#7D5EBA] rounded-md h-[41px] w-[41px] flex justify-center text-center">
                      <div className="flex relative bg-transparent flex-col justify-center items-center">
                        <img
                          src="/right.svg"
                          alt="righticon"
                          className="text-end absolute top-1 right-[-3px]"
                        />
                        <img src="/vehicle.png" alt="vehicle" className="w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="border-l-4 border-[#7D5EBA] h-12"></div>
                    <h2 className="text-left px-2 font-bold text-[40px]">
                      {superadmin === "superadmin" && flag === "false" ? (
                        <span className="text-[#7D5EBA]">
                          {standby < 10 ? "0" + standby : standby}
                        </span>
                      ) : superadmin === "superadmin" && flag === "true" ? (
                        <span className="text-[#7D5EBA]">
                          {standby < 10 ? "0" + standby : standby}
                        </span>
                      ) : (
                        <span className="text-[#7D5EBA]">
                          {standby < 10 ? "0" + standby : standby}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* box 2 ends */}

                {/* box 3  */}

                <div className="w-[268px] h-[132px] drop-shadow-custom3 rounded-xl">
                  <div className="flex justify-between px-3 pt-4">
                    <div className="font-medium text-base font-sans">
                      Cars on Rent
                    </div>
                    <div className="bg-[#53B1F1] rounded-md h-[41px] w-[41px] flex justify-center text-center">
                      <div className="flex relative bg-transparent flex-col justify-center items-center">
                        <img
                          src="/tick.svg"
                          alt="righticon"
                          className="text-end absolute top-1 right-[-3px]"
                        />
                        <img src="/vehicle.png" alt="vehicle" className="w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="border-l-4 border-[#53B1F1] h-12"></div>
                    <h2 className="text-left px-2 font-bold text-[40px]">
                      {superadmin === "superadmin" && flag === "false" ? (
                        <span className="text-[#53B1F1]">
                          {rent < 10 ? "0" + rent : rent}
                        </span>
                      ) : superadmin === "superadmin" && flag === "true" ? (
                        <span className="text-[#53B1F1]">
                          {rent < 10 ? "0" + rent : rent}
                        </span>
                      ) : (
                        <span className="text-[#53B1F1]">
                          {rent < 10 ? "0" + rent : rent}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* box 3 ends */}
                {/* box 4  */}

                <div className="w-[268px] h-[132px] drop-shadow-custom3 rounded-xl">
                  <div className="flex justify-between px-3 pt-4">
                    <div className="font-medium text-base font-sans">
                      Cars for Sale
                    </div>
                    <div className="bg-[#5A58D7] rounded-md h-[41px] w-[41px] flex justify-center text-center">
                      <div className="flex relative bg-transparent flex-col justify-center items-center">
                        <img
                          src="/dollar.svg"
                          alt="righticon"
                          className="text-end absolute top-1 right-[-3px]"
                        />
                        <img src="/vehicle.png" alt="vehicle" className="w-6" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="border-l-4 border-[#5A58D7] h-12"></div>
                    <h2 className="text-left px-2 font-bold text-[40px]">
                      {superadmin === "superadmin" && flag === "false" ? (
                        <span className="text-[#5A58D7]">
                          {sellCar < 10 ? "0" + sellCar : sellCar}
                        </span>
                      ) : superadmin === "superadmin" && flag === "true" ? (
                        <span className="text-[#5A58D7]">
                          {sellCar < 10 ? "0" + sellCar : sellCar}
                        </span>
                      ) : (
                        <span className="text-[#5A58D7]">
                          {sellCar < 10 ? "0" + sellCar : sellCar}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>
                {/* box 4 ends */}

                {/* box 5 */}

                <div className="w-[268px] h-[132px] drop-shadow-custom3 rounded-xl">
                  <div className="flex justify-between px-3 pt-4">
                    <div className="font-medium text-base font-sans break-all">
                      Cars under Maintenance
                    </div>
                    <div className="bg-[#FFB52F] rounded-md h-[41px] w-[41px] flex justify-center text-center">
                      <div className="flex relative bg-transparent flex-col justify-center items-center">
                        <img
                          src="/maint.svg"
                          alt="righticon"
                          className="text-end absolute top-1 right-[-3px]"
                        />
                        <img
                          src="/vehicle.png"
                          alt="vehicle"
                          className="w-6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="border-l-4 border-[#FFB52F] h-12"></div>
                    <h2 className="text-left px-2 font-bold text-[40px]">
                      {superadmin === "superadmin" && flag === "false" ? (
                        <span className="text-[#FFB52F]">
                          {maintenance < 10 ? "0" + maintenance : maintenance}
                        </span>
                      ) : superadmin === "superadmin" && flag === "true" ? (
                        <span className="text-[#FFB52F]">
                          {maintenance < 10 ? "0" + maintenance : maintenance}
                        </span>
                      ) : (
                        <span className="text-[#FFB52F]">
                          {maintenance < 10 ? "0" + maintenance : maintenance}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>
                {/* box 5 ends */}
              </section>

              <section className="flex flex-col gap-4 min-w-full mt-4 ">
              <div className="py-5">
              <div className="drop-shadow-custom4">
              {/* Dropdown to switch between tabs above the table */}
              {/* Table to display data */}
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
                    <div className="font-sans font-medium text-sm">Entries</div>
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
               
              </div>
            </div>

              <div className="overflow-x-auto min-w-full">
                <table className="min-w-full  border border-gray-200">
                  <thead>
                    <tr className="">
                      {/* Header with Select Dropdown */}
                      <th className="py-2 px-4 border-b border-gray-300 text-white bg-custom-bg">
                        <div className="flex items-center justify-center gap-2 text-white bg-custom-bg">
                          <select
                            onChange={(e) => handleTabClick(e.target.value)}
                            value={activeTab}
                            className="px-4 py-2  border-2 border-gray-400 rounded-lg text-white bg-custom-bg"
                          >
                            <option value="ALL">ALL</option>
                            <option value="MOT">MOT</option>
                            <option value="Service">Service</option>
                            <option value="RoadTax">Road Tax</option>
                          </select>
                          <span className="text-white bg-custom-bg">Vehicle</span>
                        </div>
                      </th>
  
                      {/* Table Headers */}
                      <th className="py-2 px-4 border-b border-gray-300 text-center text-white bg-custom-bg">
                        R. Number
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 text-center text-white bg-custom-bg">
                        Due Date
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 text-center text-white bg-custom-bg">
                        Description
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 text-center text-white bg-custom-bg">
                        Status
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 text-center text-white bg-custom-bg">
                        Assigned
                      </th>
                      <th className="py-2 px-4 border-b border-gray-300 text-center text-white bg-custom-bg">
                        Actions
                      </th>
                    </tr>
                  </thead>
  
                  {/* Table Body */}
                  <tbody>
                    {currentData.map((row, index) => (
                      <tr
                        key={row._id}
                        className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                      >
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                          {row.VehicleName || "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                          {row.registrationNumber || "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                          {row.dueDate || "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                          {row.daysLeft > 0
                            ? `${row.daysLeft} days left`
                            : row.daysExpired > 1
                              ? `${row.daysExpired} days expired`
                              : "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                          {row.VehicleStatus ? "Active" : "Inactive"}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                          {row.asignto || "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                          <Link
                            href={`${getPath()}${row.VehicleId}`}
                            className="bg-transparent"
                          >
                            {/* <CiWarning className="text-red-500 text-lg cursor-pointer" /> */}
                            <img src="/warning.png" alt="linkgoto" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* pagination */}
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
              </div>
              </div>
              </div>
            </section>
            </div>
          </main>
        )}
      </div>
    </>
  );
};

export default Page;
