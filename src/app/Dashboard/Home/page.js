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
import { Doughnut } from "react-chartjs-2";

import AdminDashBDoughnut from "../Components/AdminDashBDoughnut.jsx"
import { GetCompany } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas";

const Page = () => {
  const router = useRouter();
  const [superadmin, setsuperadmin] = useState("");
  const [companyname, setcompnayname] = useState("");
  const [TotalCar, setTotalcar] = useState(0);
  const[activeCars,setactiveCars]=useState([]);
  const[inactiveCars,setinactiveCars]=useState([]);
  const[activeCompanies,setactiveCompanies]=useState(0);
  const[inactiveCompanies,setinativeCompanies]=useState(0);
  const [standby, setstandby] = useState(0);
  const [sellCar, setSellcar] = useState(0);
  const [rent, setRentcar] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [flag, setflag] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  
  // Click handler to change tabs
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const fetchMOT = async () => {
    try {
      const response = await axios.get(`${API_URL_VehicleMOT}`);
      // console.log("MOT Data: ", response.data.Result);
      const filteredData = processData(response.data.Result, "motDueDate");
      setData(filteredData);
      setFilteredData(filteredData);
    } catch (error) {
      console.error("Error fetching MOT data:", error);
    }
  };

  const fetchService = async () => {
    try {
      const response = await axios.get(`${API_URL_VehicleService}`);
      // console.log("Service Data: ", response.data.Result);
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
      // console.log("RoadTax Data: ", response.data.Result);
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
      // console.log(combinedData)
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
  const getPath = () => {
    switch (activeTab) {
      case "Service":
        return `/Dashboard/Vehicle/AddServiceReport/`;
      case "RoadTax":
        return `/Dashboard/Vehicle/AddRoadTaxReport/`;
      case "MOT":
      default:
        return `/Dashboard/Vehicle/AddMOTReport/`;
    }
  };
  useEffect(() => {
    const companyName = getCompanyName();
    const companyuser = getUserName();
    const userrole = getUserRole();
    console.log(data)
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
          return item.adminCompanyName.toLowerCase() === companyName.toLowerCase();
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
      //getting active cars 
      const ActiveCars=result.filter((cars)=>(cars.isActive));
      setactiveCars(ActiveCars);
      //getting inactive cars 
      const InActiveCars=result.filter((cars)=>(!(cars.isActive)));
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
  const companiesData={
    labels:["Inactive","Active"],
    datasets:[
        {
        label:"Companies Status",
        data:[inactiveCompanies,activeCompanies],
        backgroundColor:["#404CA0","#27273AEB"],
        borderWidth:1
        },
    ]
};
  const carsData={
    labels:["Inactive","Active"],
    datasets:[
        {
        label:"Cars Status",
        data:[inactiveCars.length,activeCars.length],
        backgroundColor:["#404CA0","#27273AEB"],
        borderWidth:1
        },
    ]
};
  
const options={
    responsive:true,
    plugins: {
        legend: {
          display: false, // Hide the default legend
        },
}
}

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4 overflow-hidden" style={{height:"calc(100vh - 76px)"}}>
        <Sidebar />
          {/* ali */}
          {
            (superadmin==="superadmin" && flag==="false")?(
              <div className=" mt-5 overflow-auto w-[80%] xl:w-[85%]">
          <h1 className="text-[#313342] font-medium text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8">Dashboard</h1>
          <div className="flex w-full gap-5 flex-wrap">
          <AdminDashBDoughnut link={"/Dashboard/Company/AllCompanies"} title="Companies" data={companiesData} option={options}  ></AdminDashBDoughnut>
          <AdminDashBDoughnut title="Cars" data={carsData} option={options}  ></AdminDashBDoughnut>
          </div>
          </div>
            ):<main className="w-full mt-5">
            <HeroSection />
            <section className="grid grid-cols-4  min-w-full justify-between gap-2 text-center rounded-xl">
              <div className="w-[268px] h-[132px] shadow-xl rounded-xl">
                <div className="flex justify-between mt-3 px-3 py-1">
                  <div className="font-medium">Total Cars</div>
                  <div className="bg-[#DC4E8C] rounded-md h-[41px] w-[41px] flex justify-center text-center">
                    <div className="flex bg-transparent flex-col justify-center">
                      <img src="/vehicle.png" alt="vehicle" className="w-6" />
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="border-l-4 border-[#DC4E8C] h-12"></div>
                  <h2 className="text-left pl-10 font-bold text-4xl">
                    {superadmin === "superadmin" && flag === "false" ? (
                      <span className="text-[#DC4E8C]">{TotalCar}</span>
                    ) : superadmin === "superadmin" && flag === "true" ? (
                      <span className="text-[#DC4E8C]">{TotalCar}</span>
                    ) : (
                      <span className="text-[#DC4E8C]">{TotalCar}</span>
                    )}
                  </h2>
                </div>
              </div>
              <div className="w-[268px] h-[132px] shadow-md px-3 py-1  rounded-md relative">
                <div className="flex justify-between mt-3">
                  <div className="font-medium">Cars for Rent</div>
                  <div
                    className=" rounded-md h-[41px] w-[41px] flex justify-center text-center"
                    style={{
                      backgroundColor: "#7D5EBA",
                    }}
                  >
                    <div className="flex bg-transparent flex-col relative">
                      <img
                        src="/right.png"
                        alt="righticon"
                        className="h-2 w-2 text-end absolute top-1 right-0"
                      />
                      <img
                        src="/vehicle.png"
                        alt="vehicle"
                        className="text-end mt-2 w-6"
                      />
                    </div>{" "}
                  </div>
                </div>
                <div
                  className="h-12 absolute left-0 top-14"
                  style={{
                    border: "3px solid #7D5EBA",
                  }}
                ></div>
                <h2 className="text-left pl-10 font-bold text-4xl">
                  {superadmin === "superadmin" && flag === "false" ? (
                    <span style={{ color: " #7D5EBA" }}>{standby}</span>
                  ) : superadmin === "superadmin" && flag === "true" ? (
                    <span style={{ color: " #7D5EBA" }}>{standby}</span>
                  ) : (
                    <span style={{ color: " #7D5EBA" }}>{standby}</span>
                  )}
                </h2>
              </div>
              <div className="w-[268px] h-[132px] shadow-md p-2 shadow-blue-200 rounded-md relative">
                <div className="flex justify-between mt-3">
                  <div className="font-medium">Cars on Rent</div>
                  <div
                    className=" rounded-md h-[41px] w-[41px] flex justify-center text-center"
                    style={{
                      backgroundColor: "#53B1F1",
                    }}
                  >
                    <div className="flex bg-transparent flex-col relative">
                      <img
                        src="/tick.png"
                        alt="righticon"
                        className="h-2 w-2 text-end absolute top-1 right-0"
                      />
                      <img
                        src="/tick.png"
                        alt="righticon"
                        className="h-2 w-2 text-end absolute top-1 left-2 right-0"
                      />
                      <img
                        src="/vehicle.png"
                        alt="vehicle"
                        className="text-end mt-3  w-6"
                      />
                    </div>{" "}
                  </div>
                </div>
                <div
                  className="h-12 absolute left-0 top-14"
                  style={{
                    border: "3px solid #53B1F1",
                  }}
                ></div>
                <h2 className="text-left pl-10 font-bold text-4xl">
                  {superadmin === "superadmin" && flag === "false" ? (
                    <span style={{ color: " #53B1F1" }}>{rent}</span>
                  ) : superadmin === "superadmin" && flag === "true" ? (
                    <span style={{ color: " #53B1F1" }}>{rent}</span>
                  ) : (
                    <span style={{ color: " #53B1F1" }}>{rent}</span>
                  )}
                </h2>
              </div>
              <div className="w-[268px] h-[132px] shadow-md p-2 shadow-blue-200 rounded-md relative">
                <div className="flex justify-between mt-3">
                  <div className="font-medium">Cars for Sale</div>
                  <div
                    className=" rounded-md h-[41px] w-[41px] flex justify-center text-center"
                    style={{
                      backgroundColor: "#5A58D7",
                    }}
                  >
                    <div className="flex bg-transparent flex-col relative">
                      <img
                        src="/dollar.png"
                        alt="righticon"
                        className=" text-end absolute top-1 right-0"
                      />
                      <img
                        src="/vehicle.png"
                        alt="vehicle"
                        className="text-end mt-2 w-6"
                      />
                    </div>{" "}
                  </div>
                </div>
                <div
                  className="h-12 absolute left-0 top-14"
                  style={{
                    border: "3px solid #5A58D7",
                  }}
                ></div>
                <h2 className="text-left pl-10 font-bold text-4xl">
                  {superadmin === "superadmin" && flag === "false" ? (
                    <span style={{ color: " #5A58D7" }}>{sellCar}</span>
                  ) : superadmin === "superadmin" && flag === "true" ? (
                    <span style={{ color: " #5A58D7" }}>{sellCar}</span>
                  ) : (
                    <span style={{ color: " #5A58D7" }}>{sellCar}</span>
                  )}
                </h2>{" "}
              </div>
              <div className="w-[268px] h-[132px] shadow-md p-2 shadow-blue-200 rounded-md relative">
                <div className="flex justify-between mt-3">
                  <div  className="font-medium">Cars under Maintenance</div>
                  <div
                    className="rounded-md h-[41px] w-[41px] flex justify-center text-center"
                    style={{
                      backgroundColor: "#FFB52F",
                    }}
                  >
                    <div className="flex bg-transparent flex-col relative">
                      <img
                        src="/maint.png"
                        alt="righticon"
                        className=" text-end absolute top-1 right-0"
                      />
                      <img
                        src="/vehicle.png"
                        alt="vehicle"
                        className="text-end mt-3 w-6"
                      />
                    </div>{" "}
                  </div>
                </div>
                <div
                  className="h-12 absolute left-0 top-14"
                  style={{
                    border: "3px solid #FFB52F",
                  }}
                ></div>
                <h2 className="text-left pl-10 font-bold text-4xl">
                  {superadmin === "superadmin" && flag === "false" ? (
                    <span style={{ color: " #FFB52F" }}>{maintenance}</span>
                  ) : superadmin === "superadmin" && flag === "true" ? (
                    <span style={{ color: " #FFB52F" }}>{maintenance}</span>
                  ) : (
                    <span style={{ color: " #FFB52F" }}>{maintenance}</span>
                  )}
                </h2>{" "}
              </div>
            </section>
  
            <section className="flex flex-col gap-4 min-w-full mt-4 ">
              {/* Dropdown to switch between tabs above the table */}
              {/* Table to display data */}
              <div className="overflow-auto max-h-[400px] min-w-full">
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
                    {filteredData.map((row, index) => (
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
              </div>
            </section>
          </main>
          }
          
        
      </div>
    </>
  );
};

export default Page;
