"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import Header from "../Components/Header.js";
import Sidebar from "../Components/Sidebar.js";
import { LuBarChart2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { CiWavePulse1 } from "react-icons/ci";
import { FaChartLine } from "react-icons/fa";
import { RiFolderReceivedFill } from "react-icons/ri";
import HeroSection from "../Components/HeroSection";
import { getAuthData, isAuthenticated } from "@/utils/verifytoken";
import { GetVehicle } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas.js";
import { API_URL_VehicleMOT } from "../Components/ApiUrl/ApiUrls";
import { getCompanyName } from "@/utils/storageUtils";
import axios from "axios";
import Link from "next/link.js";
import { CiWarning } from "react-icons/ci";

const Page = () => {
  const router = useRouter();
  const [superadmin, setsuperadmin] = useState("");
  const [companyname, setcompnayname] = useState("");
  const [TotalCar, setTotalcar] = useState(0);
  const [standby, setstandby] = useState(0);
  const [sellCar, setSellcar] = useState(0);
  const [rent, setRentcar] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [flag, setflag] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetch = async () => {
    try {
      const response = await axios.get(`${API_URL_VehicleMOT}`);
      console.log("MOT Data: ", response.data.Result);

      // Filter and map records to show only those with a due date and include countdown logic
      const filteredData = response.data.Result.map((row) => {
        const motDueDate = new Date(row.motDueDate);
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set the time to midnight to avoid time issues

        // Increment current date by 1 day
        currentDate.setDate(currentDate.getDate() + 1); // Adds one day to the current date

        motDueDate.setHours(0, 0, 0, 0); // Set the time to midnight to avoid time issues

        // Compare just the date (day, month, year)
        const motDueDateParts = motDueDate.toISOString().split("T")[0]; // 'yyyy-mm-dd' format
        const currentDateParts = currentDate.toISOString().split("T")[0]; // 'yyyy-mm-dd' format

        console.log(motDueDateParts, currentDateParts);

        const diffInDays = Math.floor(
          (new Date(motDueDateParts) - new Date(currentDateParts)) /
            (1000 * 60 * 60 * 24)
        );

        // Calculate days remaining or overdue days
        let daysLeft;
        let status;
        let daysExpired = 1; // Track days expired if the MOT is expired

        if (diffInDays > 0) {
          // MOT is still active
          daysLeft = diffInDays;
          status = "Active";
        } else {
          // MOT is expired
          daysExpired = Math.abs(diffInDays);
          status = "Expired";
        }

        // Return an object with the original data, formatted date, and additional info
        return {
          ...row,
          motDueDate: motDueDateParts, // Include the formatted date
          currentDateParts,
          daysLeft,
          daysExpired,
          status, // Active or Expired
        };
      });

      // Set state with filtered data
      setData(filteredData);
      setFilteredData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const companyName = getCompanyName();

    const filtered = data.filter(
      (item) =>
        item.adminCompanyName.toLowerCase() === companyName.toLowerCase()
    );
    setFilteredData(filtered);
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
    fetch();
  }, [router]);

  Chart.register(...registerables);

  const fetchCounts = useCallback(async () => {
    try {
      const vehicleData = await GetVehicle();

      const { count, result } = vehicleData;

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

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4 ">
        <Sidebar />
        <main className="w-full mt-5 min-h-screen">
          <HeroSection />
          <section className="grid grid-cols-5 min-w-full justify-between gap-2 text-center rounded-xl">
            {[
              {
                icon: (
                  <LuBarChart2
                    size={30}
                    style={{
                      background: "#E64B87",
                    }}
                  />
                ),
                title:
                  superadmin === "superadmin" && flag === "false"
                    ? "Total Cars"
                    : superadmin === "superadmin" && flag === "true"
                    ? "Total Cars"
                    : "Total Cars",
                count:
                  superadmin === "superadmin" && flag === "false"
                    ? TotalCar
                    : superadmin === "superadmin" && flag === "true"
                    ? TotalCar
                    : TotalCar,
                colorx: {
                  background: "#E64B87",
                },
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #E64B87, #B35A9E)",
                },
              },
              {
                icon: (
                  <FaChartLine
                    size={30}
                    style={{
                      background: "#8461BF",
                    }}
                  />
                ),

                title:
                  superadmin === "superadmin" && flag === "false"
                    ? "Cars for Rent"
                    : superadmin === "superadmin" && flag === "true"
                    ? "Cars for Rent"
                    : "Cars for Rent",
                count:
                  superadmin === "superadmin" && flag === "false"
                    ? standby
                    : superadmin === "superadmin" && flag === "true"
                    ? standby
                    : standby,

                colorx: {
                  background: "#8461BF",
                },
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #8461BF, #4F4699)",
                },
              },
              {
                icon: (
                  <CiWavePulse1
                    size={30}
                    style={{
                      background: "#47C2FF",
                    }}
                  />
                ),
                title:
                  superadmin === "superadmin" && flag === "false"
                    ? "Cars for sale"
                    : superadmin === "superadmin" && flag === "true"
                    ? "Cars for sale"
                    : "Cars for sale",
                count:
                  superadmin === "superadmin" && flag === "false"
                    ? sellCar
                    : superadmin === "superadmin" && flag === "true"
                    ? sellCar
                    : sellCar,
                colorx: {
                  background: "#47C2FF",
                },
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #47C2FF, #6893D8)",
                },
              },
              {
                icon: (
                  <LuBarChart2
                    size={30}
                    style={{
                      background: "#47C2FF",
                    }}
                  />
                ),
                color: "text-red-500",
                title:
                  superadmin === "superadmin" && flag === "false"
                    ? "Cars on Rent"
                    : superadmin === "superadmin" && flag === "true"
                    ? "Cars on Rent"
                    : "Cars on Rent",
                count:
                  superadmin === "superadmin" && flag === "false"
                    ? rent
                    : superadmin === "superadmin" && flag === "true"
                    ? rent
                    : rent,
                colorx: {
                  background: "#47C2FF",
                },
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #47C2FF, #6893D8)",
                },
              },
              {
                title:
                  superadmin === "superadmin" && flag === "false"
                    ? "Cars out for Maintenance"
                    : superadmin === "superadmin" && flag === "true"
                    ? "Cars out for Maintenance"
                    : "Cars out for Maintenance",
                count:
                  superadmin === "superadmin" && flag === "false"
                    ? maintenance
                    : superadmin === "superadmin" && flag === "true"
                    ? maintenance
                    : maintenance,
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #FFB72D, #F38459)",
                },
                colorx: {
                  background: "#FFB72D",
                },
                icon: (
                  <RiFolderReceivedFill
                    size={30}
                    style={{
                      background: "#FFB72D",
                      color: "white",
                    }}
                  />
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`border-2 shadow-sm shadow-custom-blue rounded-md py-3 ${item.gradient} text-white`}
                style={item.style}
              >
                <div
                  className={`flex items-center flex-col sm:flex-row gap-4 justify-start ml-3 bg-transparent`}
                  style={item.style}
                >
                  <div
                    className={`flex flex-col items-start gap-2 justify-starttext-white`}
                    style={{ ...item.colorx, backgroundColor: "transparent" }}
                  >
                    <span
                      className={`font-medium text-white`}
                      style={{ ...item.colorx, backgroundColor: "transparent" }}
                    >
                      {item.title}
                    </span>

                    <span
                      className={`text-start text-white`}
                      style={{ backgroundColor: "transparent", color: "white" }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span
                    className="text-2xl text-white"
                    style={{ ...item.colorx, backgroundColor: "transparent" }}
                  >
                    <strong
                      style={{ ...item.colorx, backgroundColor: "transparent" }}
                      className="text-white"
                    ></strong>{" "}
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="flex gap-4 min-w-full justify-between mt-4 ">
            <div className="overflow-auto max-h-[200px] table-auto  min-w-full">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-800 text-white text-sm bg-transparent">
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Vehicle
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      R.Number
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      MOT Dates
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      MOT Cycle
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Next MOT Date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Current date
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Description
                    </th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Status
                    </th>
                    {/* <th className="py-2 px-4 border-b border-gray-300 text-left">
                      MOT Assign
                    </th> */}
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.VehicleName}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.registrationNumber}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {(() => {
                          const date = new Date(row.motCurrentDate);
                          const formattedDate = `${String(
                            date.getDate()
                          ).padStart(2, "0")}/${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}/${date.getFullYear()}`;
                          return formattedDate;
                        })() || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.motCycle || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.motDueDate || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.currentDateParts || "N/A"}
                      </td>

                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.daysLeft > 0
                          ? `${row.daysLeft} days left`
                          : row.daysExpired > 1
                          ? `${row.daysExpired} days expired`
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {row.status || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <Link
                          href={`/Dashboard/Vehicle/AddMOTReport/${row._id}`}
                          className="bg-transparent"
                        >
                          <CiWarning />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Page;
