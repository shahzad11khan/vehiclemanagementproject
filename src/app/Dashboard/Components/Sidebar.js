"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { FaHouseLaptop } from "react-icons/fa6";
import { FaCar, FaIndustry } from "react-icons/fa";
// import { TbReport } from "react-icons/tb";
// import { MdManageSearch } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { GrSystem } from "react-icons/gr";
import { RiOrganizationChart } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";
import { getAuthData, isAuthenticated } from "@/utils/verifytoken";
const Sidebar = () => {
  const [role, setrole] = useState("");
  const [flag, setflag] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      const authData = getAuthData();
      setrole(authData.role);
      setflag(authData.flag);
    } else {
      console.log("User is not authenticated");
    }
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpenManagement, setIsOpenManagement] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [openDropdown, setOpenDropdown] = useState(null);
  const [activeLink, setActiveLink] = useState("/Dashboard/Home");
  useEffect(() => {
    const path = window.location.pathname;
    setActiveLink(path);
  }, []);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  // const handleMouseEnter = (dropdown) => {
  //   setOpenDropdown(dropdown);
  // };

  // const handleMouseLeave = () => {
  //   setOpenDropdown(null);
  // };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCardClick = () => {
    window.location.reload();
    localStorage.setItem("flag", "false");
    localStorage.setItem("Iscompanyselected", "No");
    localStorage.removeItem("companyName");
  };
  return (
    <div className="relative bg-yellow-300">
      <button
        className="fixed top-3 left-4 z-50 block lg:hidden text-sm"
        onClick={handleToggleSidebar}
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>
      <aside
        className={`bg-white text-black  min-h-screen lg:w-52 w-20 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative top-0 left-0 flex flex-col shadow-2xl  mt-1 shadow-custom-blue`}
      >
        <nav className="flex-1">
          <ul className="space-y-1">
            <Link passHref href="/Dashboard/Home">
              <li
                onClick={() => handleLinkClick("/Dashboard/Home")}
                className={`${
                  activeLink === "/Dashboard/Home"
                    ? "border-l-4 border-red-400"
                    : "bg-white text-blue"
                } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
              >
                <div className="flex items-center gap-3 ">
                  <FaHome
                    className={`${
                      activeLink === "/Dashboard/Home"
                        ? "text-red-400"
                        : "text-black text-sm "
                    } `}
                  />
                  <span className="hidden sm:block text-sm ">Dashboard</span>
                </div>
              </li>
            </Link>
            {role === "superadmin" && flag === "false" ? (
              <>
                <Link passHref href="/Dashboard/Company/GetAllCompanies">
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Company/GetAllCompanies")
                    }
                    className={`${
                      activeLink === "/Dashboard/Company/GetAllCompanies"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <FaHouseLaptop
                        className={`${
                          activeLink === "/Dashboard/Company/GetAllCompanies"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                        style={{
                          backgroundColor: "transparent",
                        }}
                      />
                      <span
                        className="hidden sm:block text-sm"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        Registered Companies
                      </span>
                    </div>
                  </li>
                </Link>
                <Link passHref href="/Dashboard/Superadmin">
                  <li
                    onClick={() => handleLinkClick("/Dashboard/Superadmin")}
                    className={`${
                      activeLink === "/Dashboard/Superadmin"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <FaIndustry
                        className={`${
                          activeLink === "/Dashboard/Superadmin"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span
                        className="hidden sm:block text-sm"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        All Companies
                      </span>
                    </div>
                  </li>
                </Link>

                <Link passHref href="/Dashboard/Title/GetAllTitles">
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Title/GetAllTitles")
                    }
                    className={`${
                      activeLink === "/Dashboard/Title/GetAllTitles"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <GrSystem
                        className={`${
                          activeLink === "/Dashboard/Title/GetAllTitles"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">System</span>
                    </div>
                  </li>
                </Link>

                <Link passHref href={"/Dashboard/Users/GetAllusers"}>
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Users/GetAllusers")
                    }
                    className={`${
                      activeLink === "/Dashboard/Users/GetAllusers"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <RiOrganizationChart
                        className={`${
                          activeLink === "/Dashboard/Users/GetAllusers"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">
                        Superadmin Users
                      </span>
                    </div>
                  </li>
                </Link>

                <div>
                  <li
                    onMouseEnter={() => setIsOpenManagement(true)}
                    onMouseLeave={() => setIsOpenManagement(false)}
                    className={`${
                      isOpenManagement === true
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg relative`}
                  >
                    <div className="flex items-center gap-3 relative">
                      <CiSettings
                        className={`${
                          isOpenManagement === true
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">Settings</span>

                      {isOpenManagement && (
                        <div className="absolute left-36 mt-2 w-full sm:w-[170px] hover:bg-gray-200   border border-gray-300 rounded-md shadow-lg ">
                          <ul className=" space-y-1 p-3">
                            <li>
                              <Link
                                href="/Dashboard/Models/Manufacturer/GetManufacturers"
                                className="rounded hover:bg-gray-200"
                              >
                                All Manufacturers
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/CarModels/GetCarsModels"
                                className="rounded hover:bg-gray-200"
                              >
                                All Models
                              </Link>
                            </li>
                            {/* <li>
                              <Link
                                href="/Dashboard/Models/VehicleType/GetVehicleTypes"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Vehicle Types
                              </Link>
                            </li> */}
                            {/* <li>
                              <Link
                                href="/Dashboard/Models/Enquiry/GetEnquiries"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Enquiries
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Firm/GetFirms"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Firms
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Signature/GetSignatures"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Signatures
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/LocalAuthority/GetLocalAuthority"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Local Authority
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Supplier/GetSuppliers"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Suppliers
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Employee/GetEmploies"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Employees
                              </Link>
                            </li> */}
                            {/* <li>
                              <Link
                                href="/Dashboard/Models/Badge/GetBadges"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Badges
                              </Link>
                            </li> */}
                            {/* <li>
                              <Link
                                href="/Dashboard/Models/Insurance/GetInsurances"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Insurances
                              </Link>
                            </li> */}
                            <li>
                              <Link
                                href="/Dashboard/Models/Type_BodyStyle/GetTypes"
                                className="  rounded hover:bg-gray-200"
                              >
                                Body Type
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/FuelType/GetFuelTypes"
                                className="  rounded hover:bg-gray-200"
                              >
                                Fuel Type
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Transmission/GetTransmissions"
                                className="  rounded hover:bg-gray-200"
                              >
                                Transmission
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                </div>
              </>
            ) : role === "superadmin" && flag === "true" ? (
              <>
                <Link passHref href="/Dashboard/Home">
                  <li className="flex items-center p-3 cursor-pointer  rounded-lg">
                    <div
                      className="flex items-center gap-3"
                      onClick={handleCardClick}
                    >
                      <IoIosArrowBack className="text-black text-sm" />
                      <span className="hidden sm:block">
                        Go Back Superadmin
                      </span>
                    </div>
                  </li>
                </Link>

                {/* <Link passHref href="/Dashboard/Title/GetAllTitles">
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Title/GetAllTitles")
                    }
                    className={`${
                      activeLink === "/Dashboard/Title/GetAllTitles"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <GrSystem
                        className={`${
                          activeLink === "/Dashboard/Title/GetAllTitles"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">System</span>
                    </div>
                  </li>
                </Link> */}

                <Link passHref href={"/Dashboard/Users/GetAllusers"}>
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Users/GetAllusers")
                    }
                    className={`${
                      activeLink === "/Dashboard/Users/GetAllusers"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <RiOrganizationChart
                        className={`${
                          activeLink === "/Dashboard/Users/GetAllusers"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">Users</span>
                    </div>
                  </li>
                </Link>

                <Link passHref href="/Dashboard/Driver/GetAllDrivers">
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Driver/GetAllDrivers")
                    }
                    className={`${
                      activeLink === "/Dashboard/Driver/GetAllDrivers"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <IoPersonAdd
                        className={`${
                          activeLink === "/Dashboard/Driver/GetAllDrivers"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm ">Driver</span>
                    </div>
                  </li>
                </Link>

                <Link passHref href="/Dashboard/Vehicle/GetAllVehicle">
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Vehicle/GetAllVehicle")
                    }
                    className={`${
                      activeLink === "/Dashboard/Vehicle/GetAllVehicle"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <FaCar
                        className={`${
                          activeLink === "/Dashboard/Vehicle/GetAllVehicle"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">Vehicle</span>
                    </div>
                  </li>
                </Link>

                <div>
                  <li
                    onMouseEnter={() => setIsOpenManagement(true)}
                    onMouseLeave={() => setIsOpenManagement(false)}
                    className={`${
                      isOpenManagement === true
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg relative`}
                  >
                    <div className="flex items-center gap-3 relative">
                      <CiSettings
                        className={`${
                          isOpenManagement === true
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">Settings</span>

                      {isOpenManagement && (
                        <div className="absolute left-36 mt-2 w-full sm:w-[170px] hover:bg-gray-200   border border-gray-300 rounded-md shadow-lg ">
                          <ul className=" space-y-1 p-3">
                            <li>
                              <Link
                                href="/Dashboard/Models/Manufacturer/GetManufacturers"
                                className="rounded hover:bg-gray-200"
                              >
                                All Manufacturers
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/VehicleType/GetVehicleTypes"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Vehicle Types
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Enquiry/GetEnquiries"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Enquiries
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Firm/GetFirms"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Firms
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Signature/GetSignatures"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Signatures
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/LocalAuthority/GetLocalAuthority"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Local Authority
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Supplier/GetSuppliers"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Suppliers
                              </Link>
                            </li>
                            {/* <li>
                              <Link
                                href="/Dashboard/Models/Employee/GetEmploies"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Employees
                              </Link>
                            </li> */}
                            {/* <li>
                              <Link
                                href="/Dashboard/Models/Badge/GetBadges"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Badges
                              </Link>
                            </li> */}
                            <li>
                              <Link
                                href="/Dashboard/Models/Insurance/GetInsurances"
                                className="  rounded hover:bg-gray-200"
                              >
                                All Insurances
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Type_BodyStyle/GetTypes"
                                className="  rounded hover:bg-gray-200"
                              >
                                Body Type
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/FuelType/GetFuelTypes"
                                className="  rounded hover:bg-gray-200"
                              >
                                Fuel Type
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Transmission/GetTransmissions"
                                className="  rounded hover:bg-gray-200"
                              >
                                Transmission
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                </div>

                {/* <div>
                  <li
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className={`${
                      isOpen === true
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <TbReport
                      className={`${
                        isOpen === true ? "text-red-400" : "text-black text-sm"
                      }`}
                    />
                    <div className="relative inline-block text-sm">
                      <span className="items-center cursor-pointer hover:bg-gray-100 rounded-lg hidden sm:block ml-2">
                        Reports
                      </span>
                      {isOpen && (
                        <div className="absolute left-36 -mt-12 w-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
                          <ul className="grid grid-row-3 w-[200px] bg-red-500">
                            <li
                              className="relative hover:bg-gray-100 cursor-pointer"
                              onMouseEnter={() =>
                                handleMouseEnter("systemReports")
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Link
                                href="#"
                                className="block px-4 py-2 text-gray-800"
                              >
                                System Reports
                              </Link>
                              {openDropdown === "systemReports" && (
                                <ul className="absolute left-32 w-[200px] bg-white  rounded-md shadow-lg space-y-4 z-50">
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3  rounded hover:bg-gray-200"
                                    >
                                      Employee Update Reports
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Rental Invoice Reports
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Overdue Payment Reports
                                    </Link>
                                  </li>
                                </ul>
                              )}
                            </li>
                            <li
                              className="relative hover:bg-gray-100 cursor-pointer"
                              onMouseEnter={() =>
                                handleMouseEnter("vehicleReports")
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Link
                                href="#"
                                className="block px-4 py-2 text-gray-800"
                              >
                                Vehicle Reports
                              </Link>
                              {openDropdown === "vehicleReports" && (
                                <ul className="absolute left-32 -mt-5 w-[160px] bg-white rounded-md shadow-lg space-y-4  z-50">
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Interim Test Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Mot Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Road Tax Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-2 rounded hover:bg-gray-200"
                                    >
                                      Test Date Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-2 rounded hover:bg-gray-200"
                                    >
                                      Plate Expiry
                                    </Link>
                                  </li>
                                </ul>
                              )}
                            </li>

                            <li
                              className="relative hover:bg-gray-100 cursor-pointer"
                              onMouseEnter={() =>
                                handleMouseEnter("driverReports")
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Link
                                href="#"
                                className="block px-4 py-2 text-gray-800"
                              >
                                Driver Reports
                              </Link>

                              {openDropdown === "driverReports" && (
                                <ul className="absolute left-32 -mt-5 w-[160px] bg-white rounded-md shadow-lg space-y-4 z-50">
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Drivers Holidays
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Licence Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Taxi Badge Expiry
                                    </Link>
                                  </li>
                                </ul>
                              )}
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                </div> */}
              </>
            ) : (
              <>
                {" "}
                {/* <Link passHref href="/Dashboard/Title/GetAllTitles">
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Title/GetAllTitles")
                    }
                    className={`${
                      activeLink === "/Dashboard/Title/GetAllTitles"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <GrSystem
                        className={`${
                          activeLink === "/Dashboard/Title/GetAllTitles"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">System</span>
                    </div>
                  </li>
                </Link> */}
                <Link passHref href={"/Dashboard/Users/GetAllusers"}>
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Users/GetAllusers")
                    }
                    className={`${
                      activeLink === "/Dashboard/Users/GetAllusers"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <RiOrganizationChart
                        className={`${
                          activeLink === "/Dashboard/Users/GetAllusers"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">Users</span>
                    </div>
                  </li>
                </Link>
                <Link passHref href="/Dashboard/Driver/GetAllDrivers">
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Driver/GetAllDrivers")
                    }
                    className={`${
                      activeLink === "/Dashboard/Driver/GetAllDrivers"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <IoPersonAdd
                        className={`${
                          activeLink === "/Dashboard/Driver/GetAllDrivers"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm ">Driver</span>
                    </div>
                  </li>
                </Link>
                <Link passHref href="/Dashboard/Vehicle/GetAllVehicle">
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Vehicle/GetAllVehicle")
                    }
                    className={`${
                      activeLink === "/Dashboard/Vehicle/GetAllVehicle"
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <div className="flex items-center gap-3">
                      <FaCar
                        className={`${
                          activeLink === "/Dashboard/Vehicle/GetAllVehicle"
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">Vehicle</span>
                    </div>
                  </li>
                </Link>
                <div>
                  <li
                    onMouseEnter={() => setIsOpenManagement(true)}
                    onMouseLeave={() => setIsOpenManagement(false)}
                    className={`${
                      isOpenManagement === true
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg relative`}
                  >
                    <div className="flex items-center gap-3 relative">
                      <CiSettings
                        className={`${
                          isOpenManagement === true
                            ? "text-red-400"
                            : "text-black text-sm"
                        }`}
                      />
                      <span className="hidden sm:block text-sm">Settings</span>

                      {isOpenManagement && (
                        <div className="absolute left-36 mt-2 w-full sm:w-[170px] hover:bg-gray-200   border border-gray-300 rounded-md shadow-lg">
                          <ul className="grid grid-cols-1 space-y-1 p-3">
                            <li>
                              <Link
                                href="/Dashboard/Models/Manufacturer/GetManufacturers"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Manufacturers
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/VehicleType/GetVehicleTypes"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Vehicle Types
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Enquiry/GetEnquiries"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Enquiries
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Firm/GetFirms"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Firms
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Signature/GetSignatures"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Signatures
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/LocalAuthority/GetLocalAuthority"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Local Authority
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Supplier/GetSuppliers"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Suppliers
                              </Link>
                            </li>
                            {/* <li>
                              <Link
                                href="/Dashboard/Models/Employee/GetEmploies"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Employees
                              </Link>
                            </li> */}
                            <li>
                              <Link
                                href="/Dashboard/Models/Badge/GetBadges"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Badges
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Insurance/GetInsurances"
                                className=" py-2 rounded hover:bg-gray-200"
                              >
                                All Insurances
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Type_BodyStyle/GetTypes"
                                className="  rounded hover:bg-gray-200"
                              >
                                Body Type
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/FuelType/GetFuelTypes"
                                className="  rounded hover:bg-gray-200"
                              >
                                Fuel Type
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/Dashboard/Models/Transmission/GetTransmissions"
                                className="  rounded hover:bg-gray-200"
                              >
                                Transmission
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                </div>
                {/* <div>
                  <li
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className={`${
                      isOpen === true
                        ? "border-l-4 border-red-400"
                        : "bg-white text-blue"
                    } flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg`}
                  >
                    <TbReport
                      className={`${
                        isOpen === true ? "text-red-400" : "text-black text-sm"
                      }`}
                    />
                    <div className="relative inline-block text-sm">
                      <span className="items-center cursor-pointer hover:bg-gray-100 rounded-lg hidden sm:block ml-2">
                        Reports
                      </span>
                      {isOpen && (
                        <div className="absolute left-36 -mt-12 w-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
                          <ul className="grid grid-row-3 w-[200px] bg-red-500">
                            <li
                              className="relative hover:bg-gray-100 cursor-pointer"
                              onMouseEnter={() =>
                                handleMouseEnter("systemReports")
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Link
                                href="#"
                                className="block px-4 py-2 text-gray-800"
                              >
                                System Reports
                              </Link>
                              {openDropdown === "systemReports" && (
                                <ul className="absolute left-32 w-[200px] bg-white  rounded-md shadow-lg space-y-4 z-50">
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3  rounded hover:bg-gray-200"
                                    >
                                      Employee Update Reports
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Rental Invoice Reports
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Overdue Payment Reports
                                    </Link>
                                  </li>
                                </ul>
                              )}
                            </li>
                            <li
                              className="relative hover:bg-gray-100 cursor-pointer"
                              onMouseEnter={() =>
                                handleMouseEnter("vehicleReports")
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Link
                                href="#"
                                className="block px-4 py-2 text-gray-800"
                              >
                                Vehicle Reports
                              </Link>
                              {openDropdown === "vehicleReports" && (
                                <ul className="absolute left-32 -mt-5 w-[160px] bg-white rounded-md shadow-lg space-y-4  z-50">
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Interim Test Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Mot Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Road Tax Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-2 rounded hover:bg-gray-200"
                                    >
                                      Test Date Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-2 rounded hover:bg-gray-200"
                                    >
                                      Plate Expiry
                                    </Link>
                                  </li>
                                </ul>
                              )}
                            </li>

                            <li
                              className="relative hover:bg-gray-100 cursor-pointer"
                              onMouseEnter={() =>
                                handleMouseEnter("driverReports")
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Link
                                href="#"
                                className="block px-4 py-2 text-gray-800"
                              >
                                Driver Reports
                              </Link>

                              {openDropdown === "driverReports" && (
                                <ul className="absolute left-32 -mt-5 w-[160px] bg-white rounded-md shadow-lg space-y-4 z-50">
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Drivers Holidays
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Licence Expiry
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href="#"
                                      className="px-4 py-3 rounded hover:bg-gray-200"
                                    >
                                      Taxi Badge Expiry
                                    </Link>
                                  </li>
                                </ul>
                              )}
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                </div> */}
              </>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
