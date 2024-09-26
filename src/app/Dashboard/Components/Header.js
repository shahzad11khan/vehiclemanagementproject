"use client";
// import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  // const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [imagePreview, setImagePreview] = useState("");

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  return (
    <header className=" text-black flex items-center justify-between opacity-90 w-full shadow-sm shadow-custom-blue">
      {/* Left side: Logo */}
      <div className="flex flex-shrink-0 py-5 px-3 bg-gradient-to-r from-rose-400 to-purple-200">
        <span className="text-sm font-sm text-white">
          Vehicle Management System
        </span>
      </div>

      {/* Middle: Encoderbytes */}
      {/* <div className="flex items-start justify-start  flex-grow md:flex ml-3">
        <span className="text-lg font-bold">Vehicle Management System</span>
      </div> */}

      {/* Right side: Profile and Dropdown */}
      <div className="flex items-center">
        <h6 className="mr-4 hidden md:block">Shahzad Khan</h6>
        <div className="relative">
          <Image
            src={"/uploads/" + "imagePreview"}
            alt="Profile"
            className="h-8 w-8 rounded-full cursor-pointer"
            height={40}
            width={40}
            onClick={toggleDropdown}
          />
          {/* Dropdown */}
          {typeof window !== "undefined" && isDropdownOpen && (
            <div className="absolute right-0 mt-2 flex flex-col bg-white rounded shadow-lg z-10 text-black">
              <ul className="">
                <Link href="/AdminDashboard/Profile">
                  <li className="px-4 py-2 hover:bg-custom-blue cursor-pointer rounded-lg flex items-center">
                    <CgProfile className="mr-2" />
                    <span className="hidden md:inline">Profile</span>
                  </li>
                </Link>
                <li className="px-4 py-2 hover:bg-custom-blue cursor-pointer rounded-lg flex items-center">
                  <button
                  //   onClick={handleLogout}
                  >
                    <IoIosLogOut className="mr-2" />
                    <span className="hidden md:inline">Logout</span>
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
