"use client";
import axios from "axios";
// import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { getCompanyName } from "../../../../utils/storageUtils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL_Company, API_URL_USER } from "../Components/ApiUrl/ApiUrls";
import { isAuthenticated, clearAuthData } from "@/utils/verifytoken";
// import axios from "axios";

const Header = () => {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // Check if window is defined (i.e., the code is running on the client-side)
    if (typeof window !== "undefined") {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push("/"); // Redirect to login page if not authenticated
        return;
      }

      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      console.log(userId);
      console.log(role);

      if (userId) {
        showalladmins(userId);
        setRole(role);
      }
    }
  }, []);

  const showalladmins = async (userId) => {
    try {
      const res = await axios.get(`${API_URL_Company}/${userId}`);
      const adminData = res.data.result;
      // console.log("Company Data", adminData);

      if (adminData._id === userId) {
        setImagePreview(adminData.image);
      } else {
        // Fetch user data from another table (assuming this endpoint exists)
        const userRes = await axios.get(`${API_URL_USER}/${userId}`); // Fetch user data
        const userData = userRes.data.result; // Adjust based on your API response structure
        // console.log("User Data", userData);
        setImagePreview(userData.useravatar);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };
  useEffect(() => {
    const companyNameFromStorage = getCompanyName();
    if (companyNameFromStorage) {
      setCompanyName(companyNameFromStorage);
    }
  }, []);
  const handleLogout = useCallback(async () => {
    if (isAuthenticated()) {
      clearAuthData();
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/");
      toast.success("Logged out successfully");
    } else {
      console.log("User is not authenticated");
    }
  }, [router]);
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  return (
    <header className=" text-black flex items-center justify-between opacity-90 w-full shadow-sm shadow-custom-blue">
      {/* Left side: Logo */}
      <div className="flex flex-shrink-0 py-5 px-3 bg-gradient-to-r from-rose-400 to-purple-200">
        <span className="text-sm font-sm text-white bg-transparent">
          Vehicle Management System{" "}
          {/* {companyName ? (
            <div>
              <p>Company Name:{companyName === undefined ? "" : companyName}</p>
            </div>
          ) : (
            <p>No company selected.</p>
          )} */}
        </span>
      </div>

      {/* Middle: Encoderbytes */}
      {/* <div className="flex items-start justify-start  flex-grow md:flex ml-3">
        <span className="text-lg font-bold">Vehicle Management System</span>
      </div> */}

      {/* Right side: Profile and Dropdown */}
      <div className="flex items-center">
        <h6 className="mr-4 hidden md:block">
          {companyName ? (
            <div>
              <p> {companyName === undefined ? "" : companyName}</p>
            </div>
          ) : (
            <p>No Name.</p>
          )}
        </h6>
        <div className="relative">
          <div
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          >
            <img src={imagePreview} alt="Profile" height={40} width={40} />
          </div>

          {/* Dropdown */}
          {typeof window !== "undefined" && isDropdownOpen && (
            <div className="absolute right-0 mt-2 flex flex-col bg-white rounded shadow-lg z-10 text-black">
              <ul className="">
                {role === "superadmin" ||
                role === "admin" ||
                role === "user" ? (
                  <Link href="/Dashboard/Profile">
                    <li className="px-4 py-2 hover:bg-cyan-100 cursor-pointer rounded-lg flex items-center">
                      <CgProfile className="mr-2" />
                      <span
                        className="hidden md:inline"
                        style={{ backgroundColor: "transparent" }}
                      >
                        Profile
                      </span>
                    </li>
                  </Link>
                ) : (
                  <Link href="/Dashboard/CompanyProfile">
                    <li className="px-4 py-2 hover:bg-cyan-100 cursor-pointer rounded-lg flex items-center">
                      <CgProfile className="mr-2" />
                      <span
                        className="hidden md:inline"
                        style={{ backgroundColor: "transparent" }}
                      >
                        Profile
                      </span>
                    </li>
                  </Link>
                )}

                <li className="px-4 py-2 hover:bg-cyan-100 cursor-pointer rounded-lg flex items-center">
                  <button onClick={handleLogout}>
                    <IoIosLogOut className="mr-2" />
                    <span
                      className="hidden md:inline"
                      style={{ backgroundColor: "transparent" }}
                    >
                      Logout
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu toggle */}
      <div className="block md:hidden">
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
      </div>
    </header>
  );
};

export default Header;
