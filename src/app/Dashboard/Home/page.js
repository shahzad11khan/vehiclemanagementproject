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

  useEffect(() => {
    if (isAuthenticated()) {
      const authData = getAuthData();
      setsuperadmin(authData.role);
      setflag(authData.flag);
      setcompnayname(authData.companyName);
    } else {
      router.push("/");
      return;
    }
  }, []);

  Chart.register(...registerables);

  const fetchCounts = useCallback(async () => {
    try {
      const vehicleData = await GetVehicle();

      // Destructure count and result from vehicleData
      const { count, result } = vehicleData;

      // Set total car count only if it changes
      setTotalcar((prev) => (prev !== count ? count : prev));

      // Early return if no vehicles are available
      if (!result || result.length === 0) {
        // Reset all counts only if they aren't already zero
        setstandby((prev) => (prev !== 0 ? 0 : prev));
        setSellcar((prev) => (prev !== 0 ? 0 : prev));
        setRentcar((prev) => (prev !== 0 ? 0 : prev));
        setMaintenance((prev) => (prev !== 0 ? 0 : prev));
        return;
      }

      // Initialize counters for vehicle statuses
      let standbyCar = 0;
      let sellCar = 0;
      let rentCar = 0;
      let maintenance = 0;

      // Iterate over the vehicles
      result.forEach((vehicle) => {
        // Count vehicles if superadmin or matching company name
        if (
          superadmin === "superadmin" ||
          vehicle.adminCompanyName === companyname
        ) {
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
            default:
              break; // Ignore unrecognized statuses
          }
        }
      });

      // Update states only if the count has changed
      setstandby((prev) => (prev !== standbyCar ? standbyCar : prev));
      setSellcar((prev) => (prev !== sellCar ? sellCar : prev));
      setRentcar((prev) => (prev !== rentCar ? rentCar : prev));
      setMaintenance((prev) => (prev !== maintenance ? maintenance : prev));
    } catch (error) {
      console.error(`Failed to fetch data: ${error}`);
    }
  }, [companyname, superadmin]);

  // Only re-fetch when necessary
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
            {/* First Container - Customer Data */}
            {/* <div className="flex flex-col w-3/6  p-4 rounded-md shadow">
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
            </div> */}

            {/* Second Container - User Table */}
            {/* <div className="w-full bg-white p-4 rounded-md shadow">
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
            </div> */}
          </section>
        </main>
      </div>
    </>
  );
};

export default Page;
