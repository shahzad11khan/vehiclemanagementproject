"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useCallback, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import {
  getCompanyName,
  getUserId,
  getUserName,
  getUserRole,
  getflag,
  getCompanyId,
} from "../../../../utils/storageUtils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL_Company, API_URL_USER } from "../Components/ApiUrl/ApiUrls";
import { isAuthenticated, clearAuthData } from "@/utils/verifytoken";

const Header = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [compId, setcompId] = useState("");
  const [role, setRole] = useState("");
  const [flag, setflag] = useState(false);
  const [username, setusername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    const userId = getUserId();
    const flag = getflag();
    setflag(flag);
    const companyId = getCompanyId();
    setcompId(companyId);

    const username = getUserName();
    const role = getUserRole();
    const companyNameFromStorage = getCompanyName();
    if (role) setRole(role);
    if (username) setusername(username);
    if (companyNameFromStorage) setCompanyName(companyNameFromStorage);
    if (flag === "true" && companyId) {
      showAllAdmins(compId);
    } else {
      showAllAdmins(userId);
    }
  }, []);

  const showAllAdmins = async (id) => {
    try {
      const res = await axios.get(`${API_URL_Company}/${id}`);
      const adminData = res.data.result;

      if (adminData?._id === id) {
        setImagePreview(adminData.image);
      } else if (adminData?._id === id && flag === "true") {
        setImagePreview(adminData.image);
      } else {
        const userRes = await axios.get(`${API_URL_USER}/${id}`);
        const userData = userRes.data.result;
        if (userData?.useravatar) {
          setImagePreview(userData.useravatar);
        }
      }
    } catch (error) {
      console.error(`Error fetching data for user ${userId}:`, error);
    }
  };

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
      <div className="flex flex-shrink-0 py-5 px-3 bg-gradient-to-r from-rose-400 to-purple-200">
        <span className="text-sm font-sm text-white bg-transparent">
          Vehicle Management System{" "}
        </span>
      </div>

      <div className="flex items-center">
        <h6 className="mr-4 hidden md:block">
          {role === "superadmin" && flag === "false" ? (
            <div>
              <p>{username}</p>
            </div>
          ) : role === "superadmin" && flag === "true" ? (
            <p>{companyName}</p>
          ) : companyName ? (
            <p> {companyName}</p>
          ) : (
            <p> {username}</p>
          )}
        </h6>
        <div className="relative">
          <div
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={toggleDropdown}
          >
            <img src={imagePreview} alt="Profile" height={40} width={40} />
          </div>

          {typeof window !== "undefined" && isDropdownOpen && (
            <div className="absolute right-0 mt-2 flex flex-col bg-white rounded shadow-lg z-10 text-black">
              <ul className="">
                {(role === "superadmin" && flag === "false") ||
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
                ) : role === "superadmin" && flag === "true" ? (
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
