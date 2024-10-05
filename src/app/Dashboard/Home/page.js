"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Chart, registerables } from "chart.js";
import Header from "../Components/Header.js";
import Sidebar from "../Components/Sidebar.js";
// import { isAuthenticated } from "@/app/helper/verifytoken";
import { LuBarChart2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { CiWavePulse1 } from "react-icons/ci";
import { FaChartLine } from "react-icons/fa";
import { RiFolderReceivedFill } from "react-icons/ri";
import HeroSection from "../Components/HeroSection";
import Image from "next/image";
import {
  GetUsers,
  GetDriver,
  GetVehicle,
  GetManufacturer,
  GetPayment,
  GetCompany,
} from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas.js";
import {
  GetUserscount,
  GetDrivercount,
  GetVehiclecount,
  // GetVehicle,
  // GetManufacturer,
  // GetPayment,
  // GetCompany,
} from "../Components/ApiUrl/getSpecificCompanyCount/getSpecificCompanyCount.js";
import { getAuthData, isAuthenticated } from "@/utils/verifytoken";

const Page = () => {
  const router = useRouter();
  const [superadmin, setsuperadmin] = useState(""); // State to track which dropdown is open
  const [companyname, setcompanyname] = useState(""); // State to track which dropdown is open
  const [countuser, setcountuser] = useState(""); // State to track which dropdown is open
  const [countDriver, setcountDriver] = useState(""); // State to track which dropdown is open
  const [countVehicle, setcountVehicle] = useState(""); // State to track which dropdown is open

  useEffect(() => {
    if (isAuthenticated()) {
      const authData = getAuthData();
      // console.log("Authenticated user data:", authData);
      // You can access individual pieces like this:
      console.log("Username:", authData.Userusername);
      console.log("Company Name:", authData.companyName);
      console.log("Role:", authData.role);
      setsuperadmin(authData.role);
      setcompanyname(authData.companyName);
    } else {
      console.log("User is not authenticated");
    }
  }, []);

  Chart.register(...registerables);
  const [counts, setCounts] = useState({
    userCount: 0,
    driverCount: 0,
    vehicleCount: 0,
    Manufacturer: 0,
    Companies: 0,
    Payment: 0,
  });

  const fetchCounts = useCallback(async () => {
    try {
      const [
        { count: userCount }, // Filtered user count based on company
        { count: driverCount }, // Filtered driver count based on company
        { count: vehicleCount },
        { count: Manufacturer },
        { count: Payment },
        { count: Companies },
      ] = await Promise.all([
        GetUsers(), // Filtered users (by company)
        GetDriver(), // Filtered drivers (by company)
        GetVehicle(), // Total vehicles
        GetManufacturer(), // Total manufacturers
        GetPayment(), // Total payments
        GetCompany(), // Total companies
      ]);

      setCounts({
        userCount,
        driverCount,
        vehicleCount,
        Manufacturer,
        Payment,
        Companies,
      });
    } catch (error) {
      console.log(`Failed to fetch data: ${error}`);
    }
  }, []);

  useEffect(() => {
    fetchUsersCount();
    fetchCounts();
  }, [fetchCounts, router]);

  const fetchUsersCount = async () => {
    try {
      const data = await GetUserscount();
      const dataDriver = await GetDrivercount();
      const dataVehicle = await GetVehiclecount();
      // Access the filtered users and their count here
      console.log("Filtered Users:", data.result); // Array of filtered users
      console.log("User Count:", data.count); // Number of users in the filtered result
      setcountuser(data.count);
      setcountDriver(dataDriver.count);
      setcountVehicle(dataVehicle.count);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  // Call the function to execute

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
                title: superadmin === "superadmin" ? "Companies" : companyname,
                count: superadmin === "superadmin" ? counts.Companies : 0, // Count is 0 if not superadmin
                colorx: {
                  background: "#E64B87",
                  // replace with your desired hex colors
                },
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #E64B87, #B35A9E)", // replace with your desired hex colors
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

                title: superadmin === "superadmin" ? "All Users" : "Users",
                count:
                  superadmin === "superadmin" ? counts.userCount : countuser,
                colorx: {
                  background: "#8461BF",
                  // replace with your desired hex colors
                },
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #8461BF, #4F4699)", // replace with your desired hex colors
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
                title: superadmin === "superadmin" ? "All Drivers" : "Drivers",
                count:
                  superadmin === "superadmin"
                    ? counts.driverCount
                    : countDriver,
                colorx: {
                  background: "#47C2FF",
                  // replace with your desired hex colors
                },
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #47C2FF, #6893D8)", // replace with your desired hex colors
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
                  superadmin === "superadmin" ? "All Vehicles" : "Vehicles",
                count:
                  superadmin === "superadmin"
                    ? counts.vehicleCount
                    : countVehicle,
                colorx: {
                  background: "#47C2FF",
                  // replace with your desired hex colors
                },
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #47C2FF, #6893D8)", // replace with your desired hex colors
                },
              },
              {
                title: "Requests",
                count: counts.Payment || 0,
                gradient: "bg-gradient-to-r",
                style: {
                  backgroundImage:
                    "linear-gradient(to right, #FFB72D, #F38459)", // replace with your desired hex colors
                },
                colorx: {
                  background: "#FFB72D",
                  // replace with your desired hex colors
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
                  // key={index}
                  className={`flex items-center flex-col sm:flex-row gap-4 justify-start ml-3 bg-transparent`}
                  style={item.style}
                >
                  <div
                    className={`flex flex-col items-start gap-2 justify-starttext-white`}
                    style={{ ...item.colorx, backgroundColor: "transparent" }}
                  >
                    <span
                      className={`font-medium text-white`} // Removed bg-transparent, not needed with text color
                      style={{ ...item.colorx, backgroundColor: "transparent" }} // Ensure the background is transparent
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
                      style={{ ...item.colorx, backgroundColor: "transparent" }} // Corrected spelling from stong to strong
                      className="text-white" // Added text-white class
                    >
                      {/* {" $"} */}
                    </strong>{" "}
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </section>

          <section className="flex gap-4 min-w-full justify-between mt-4 ">
            {/* First Container - Customer Data */}
            <div className="flex flex-col w-3/6  p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold mb-2">Drivers</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Image
                    src="/image.jpg" // replace with actual image path
                    alt="John Smith"
                    className="w-10 h-10 rounded-full"
                    width={100}
                    height={100}
                  />
                  <div className="ml-4">
                    <strong className="text-lg block">John Smith</strong>
                    <p className="text-sm text-gray-600">
                      Is the Driver of BMW.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <Image
                    src="/image.jpg" // replace with actual image path
                    alt="Emma Johnson"
                    className="w-10 h-10 rounded-full"
                    width={100}
                    height={100}
                  />
                  <div className="ml-4">
                    <strong className="text-lg block">Emma Johnson</strong>
                    <p className="text-sm text-gray-600">
                      Is the Driver of Honda.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <Image
                    src="/image.jpg" // replace with actual image path
                    alt="David Brown"
                    className="w-10 h-10 rounded-full"
                    width={100}
                    height={100}
                  />
                  <div className="ml-4">
                    <strong className="text-lg block">David Brown</strong>
                    <p className="text-sm text-gray-600">
                      Is the Driver of Toyota.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Second Container - User Table */}
            <div className="w-full bg-white p-4 rounded-md shadow">
              <h2 className="text-lg font-semibold mb-2">User Table</h2>
              <h2 className="text-xm text-gray-600 font-semibold mb-2">
                Register User In Website
              </h2>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-white">
                    <th className="border px-4 py-2">User Name</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Is Active</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      username: "johndoe",
                      email: "john@example.com",
                      isActive: true,
                    },
                    {
                      username: "janesmith",
                      email: "jane@example.com",
                      isActive: false,
                    },
                    {
                      username: "michaelj",
                      email: "michael@example.com",
                      isActive: true,
                    },
                  ].map((user, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{user.username}</td>
                      <td className="border px-4 py-2">{user.email}</td>
                      <td className="border px-4 py-2">
                        {user.isActive ? "Yes" : "No"}
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
