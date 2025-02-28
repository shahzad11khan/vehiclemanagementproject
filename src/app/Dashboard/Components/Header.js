"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useCallback, useEffect } from "react";
// import { CgProfile } from "react-icons/cg";
// import { IoIosLogOut } from "react-icons/io";
//ali

import LogoutModal from './LogoutModal';

import {
  getCompanyName,
  getUserId,
  getUserName,
  getUserRole,
  getflag,
  getCompanyId,
} from "../../../../utils/storageUtils";
import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL_Company, API_URL_USER, API_URL_CRONJOB } from "../Components/ApiUrl/ApiUrls";
import { isAuthenticated, clearAuthData } from "@/utils/verifytoken";
import {
  API_URL_VehicleMOT,
  API_URL_VehicleService,
  API_URL_VehicleRoadTex,
} from "../Components/ApiUrl/ApiUrls";
// import { CiWarning } from "react-icons/ci";

const Header = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [flag, setflag] = useState(false);
  const [username, setusername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPendingDropdown, setIsPendingDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  //ali
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
      setData(combinedData);
      // console.log("All data :", combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Filter data based on conditions
  useEffect(() => {
    const filterData = data.filter(
      (item) =>
        username === item.asignto &&
        companyName === item.adminCompanyName &&
        (item.motPending_Done === "1" ||
          item.servicePending_Done === "1" ||
          item.roadtexPending_Done === "1")
    );
    // console.log(filterData);
    setFilteredData(filterData);
  }, [data, username]);
  // Fetch data on component mount
  useEffect(() => {
    // --------------------------
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL_CRONJOB}`);
        console.log("✅ Data updated successfully", res);
      } catch (error) {
        console.error("❌ Error updating data:", error);
      }
    };

    // Run every hour (3600000 ms)
    const interval = setInterval(fetchData, 3600000);
    // Run once on mount
    fetchData();

    return () => clearInterval(interval);



    // --------------------------
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    const userId = getUserId();
    const companyId = getCompanyId();
    const flag = getflag();
    const username = getUserName();
    const role = getUserRole();
    const companyNameFromStorage = getCompanyName();

    setflag(flag);
    setusername(username);
    setRole(role);
    setCompanyName(companyNameFromStorage);

    // Fetch admin data based on user role
    const idToFetch =
      flag === "true" && companyNameFromStorage ? companyId : userId;
    showAllAdmins(idToFetch);
  }, []);

  const showAllAdmins = async (id) => {
    try {
      // console.log(id);
      const res = await axios.get(`${API_URL_Company}/${id}`);
      const adminData = res.data.result;
      // console.log(adminData);
      if (adminData?._id === id) {
        setImagePreview(adminData.image);
      } else {
        const userRes = await axios.get(`${API_URL_USER}/${id}`);
        const userData = userRes.data.result;
        if (userData?.useravatar) {
          setImagePreview(userData.useravatar);
        }
      }
    } catch (error) {
      console.error(`Error fetching data for user ${id}:`, error);
    }
  };

  const handleLogout = useCallback(async () => {
    if (isAuthenticated()) {
      clearAuthData();
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/");
      // toast.success("Logged out successfully");
    } else {
      console.log("User is not authenticated");
    }
  }, [router]);
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const pendingDropdown = useCallback(() => {
    setIsPendingDropdown((prev) => !prev);
  });

  return (
    <header className=" relative z-50 text-black px-3  flex items-center font-sans justify-between  w-full drop-shadow-custom2 bg-[#222434ED]">
      <div className="flex flex-shrink-0 py-5 px-3  bg-transparent">
        <span className=" hidden sm:block lg:text-3xl md:text-2xl sm:text-lg font-bold text-white bg-transparent">
          {/* Vehicle Management System{" "} */}
          Vehicle Management System
        </span>
        <span className="sm:hidden text-xl font-bold bg-transparent text-white">VMS</span>
      </div>

      <div className="flex items-center bg-transparent px-2 sm:px-5 relative">
        <div className="flex gap-4 bg-transparent">
          <div className="flex gap-2 relative bg-transparent">
            {role === "user" && filteredData.length > 0 ? (
              <>
                <div
                  className="h-8 w-8 rounded-lg cursor-pointer bg-transparent"
                  onClick={pendingDropdown}
                >
                  <img
                    src="/bell.png"
                    alt="notification"
                    height={25}
                    width={25}
                  />
                </div>

                {/* Conditional Dropdown */}
                {isPendingDropdown && (
                  <div className="absolute right-0 mt-12 flex flex-col bg-white rounded shadow-lg text-black w-80 p-4  border-2 border-gray-500">
                    <p>
                      You have been assigned a task. Please review the details.
                    </p>
                  </div>
                )}
              </>
            ) : (

              // Default notification icon when no pending items
              <img
                src="/bell.svg"
                className="bg-transparent  "
                alt="no notification"
              />
            )}
          </div>

          <div className="bg-transparent">
            <h6 className="mr-4 font-sans text-lg font-medium hidden md:block bg-transparent text-white">
              {role === "superadmin" && flag === "false" ? (
                <div className="bg-transparent">
                  <p className="bg-transparent text-white">{username}</p>
                </div>
              ) : role === "superadmin" && flag === "true" ? (
                <p className="bg-transparent text-white">{companyName}</p>
              ) : role === "user" ? (
                <p className="bg-transparent text-white"> {username}</p>
              ) : (
                <p className="bg-transparent text-white"> {companyName}</p>
              )}
            </h6>
          </div>
        </div>

        <div className="relative bg-transparent">
          <div
            className=" h-[36px] w-[36px] md:h-[46px] md:w-[46px] cursor-pointer bg-transparent"
            onClick={toggleDropdown}
          >
            <img
              src={imagePreview}
              alt="Profile"
              className="rounded-full h-full w-full object-cover object-center"
            />
          </div>

          {/* Dropdown */}

          {typeof window !== "undefined" && isDropdownOpen && (
            <div className=" border-[1px] border-white  absolute right-[3px] sm:right-[2px]  h-[60px] top-5 sm:top-6 mt-2 flex rounded-bl-[9px] rounded-tl-[9px] rounded-br-[9px] flex-col ] drop-shadow-custom  z-100 w-44">
              <ul className="rounded-tl-[9px] h-[60px] rounded-bl-[9px] rounded-br-[9px]  ">
                {(role === "superadmin" && flag === "false") ||
                  role === "admin" ||
                  role === "user" ? (
                  <Link href="/Dashboard/Profile">
                    <li className="px-4 font-sans text-sm font-semibold py-2 rounded-tl-[9px] h-[50%]  cursor-pointer  flex gap-2 items-center  hover:bg-drop-custom-bg  hover:text-white group">
                      {/* <CgProfile className="mr-2 bg-transparent text-white" /> */}
                      <img src="/profile.svg" className="h-[17px] w-[17px]  group-hover:invert "></img>

                      {/* <span
                        className="hidden font-sans text-sm md:inlineh-full w-full text-black hover:text-white"
                        style={{ backgroundColor: "transparent" }}
                      > */}
                      Profile
                      {/* </span> */}
                    </li>
                  </Link>
                ) : role === "superadmin" && flag === "true" ? (
                  <Link href="/Dashboard/CompanyProfile">
                    <li className="px-4 font-sans text-sm font-semibold py-2 rounded-tl-[9px] h-[50%]  cursor-pointer  flex gap-2 items-center  hover:bg-drop-custom-bg  hover:text-white group">
                      {/* <CgProfile className="mr-2 bg-transparent text-white" /> */}
                      <img src="/profile.svg" className="h-[17px] w-[17px]  group-hover:invert "></img>

                      {/* <span
                        className="hidden font-sans text-sm md:inlineh-full w-full text-black hover:text-white"
                        style={{ backgroundColor: "transparent" }}
                      > */}
                      Profile
                      {/* </span> */}
                    </li>
                  </Link>
                ) : (
                  <Link href="/Dashboard/CompanyProfile">
                    <li className="px-4 font-sans text-sm font-semibold py-2 rounded-tl-[9px] h-[50%]  cursor-pointer  flex gap-2 items-center  hover:bg-drop-custom-bg  hover:text-white group">
                      {/* <CgProfile className="mr-2 bg-transparent text-white" /> */}
                      <img src="/profile.svg" className="h-[17px] w-[17px]  group-hover:invert "></img>

                      {/* <span
                        className="hidden font-sans text-sm md:inlineh-full w-full text-black hover:text-white"
                        style={{ backgroundColor: "transparent" }}
                      > */}
                      Profile
                      {/* </span> */}
                    </li>
                  </Link>
                )}

                <li
                  className="px-4 py-2 rounded-bl-[9px] w-full h-[50%] font-semibold font-sans text-sm rounded-br-[9px] hover:bg-drop-custom-bg cursor-pointer items-center gap-2  flex hover:text-white group"
                  onClick={
                    () => {
                      setIsLogoutModalOpen(true)
                    }
                  }
                >
                  {/* <IoIosLogOut className="mr-2 bg-transparent text-white" /> */}
                  <img className="h-[17px] w-[17px] group-hover:invert" src="/signOut.svg"></img>
                  {/* <button > */}
                  Logout
                  {/* </button> */}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* <div className="block md:hidden">
        <button onClick={toggleDropdown} className="text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div> */}

      {/*  here it works as a logoutconfirmationmodal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
