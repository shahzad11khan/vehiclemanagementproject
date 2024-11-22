"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoPersonAdd } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
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
      return;
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
    <div className="relative">
      <button
        className="fixed top-3 left-4 z-50 block lg:hidden text-sm"
        onClick={handleToggleSidebar}
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>
      <aside
        className={` text-black  min-h-screen lg:w-52 w-20 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative top-0 left-0 flex flex-col shadow-2xl  mt-1 shadow-custom-blue `}
      >
        <nav
          className="flex-1 "
          style={{
            backgroundImage: "url('/bgimage.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <ul className="space-y-1 bg-transparent">
            <Link passHref href="/Dashboard/Home">
              <li
                onClick={() => handleLinkClick("/Dashboard/Home")}
                className={`${
                  activeLink === "/Dashboard/Home"
                    ? "border-l-4 border-b-2 border-red-400"
                    : "text-blue "
                } flex items-center p-3 cursor-pointer hover:border-b-2  rounded-lg bg-transparent`}
              >
                <div className="flex items-center gap-3 hover:text-black  bg-transparent">
                  <img src="/dashboard.png" alt="dashboard" />
                  <span className="hidden sm:block text-sm text-white  bg-transparent ">
                    Dashboard
                  </span>
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
                        ? "border-l-4 border-b-2 border-red-400"
                        : "text-blue"
                    } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/reg.png" alt="reg" />
                      <span className="hidden sm:block text-sm text-white bg-transparent">
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
                        ? "border-l-4 border-b-2 border-red-400"
                        : " text-blue"
                    } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/register.png" alt="regitstercompany" />
                      <span className="hidden sm:block text-sm text-white bg-transparent">
                        All Companies
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
                        ? "border-l-4 border-b-2 border-red-400"
                        : " text-blue"
                    } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/superadmin.png" alt="superadmin" />

                      <span className="hidden sm:block text-sm text-white bg-transparent">
                        Superadmin Users
                      </span>
                    </div>
                  </li>
                </Link>

                <div className="bg-transparent">
                  <li
                    onMouseEnter={() => setIsOpenManagement(true)}
                    onMouseLeave={() => setIsOpenManagement(false)}
                    className={`${
                      isOpenManagement === true
                        ? "border-l-4 border-b-2 border-red-400"
                        : " text-blue"
                    } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg relative bg-transparent`}
                  >
                    <div className="flex items-center gap-3 relative bg-transparent">
                      <img src="/setting.png" alt="superadmin" />

                      <span className="hidden sm:block text-sm bg-transparent text-white">
                        Settings
                      </span>

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

                <Link passHref href={"/Dashboard/Users/GetAllusers"}>
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Users/GetAllusers")
                    }
                    className={`${
                      activeLink === "/Dashboard/Users/GetAllusers"
                        ? "border-l-4 border-b-2 border-red-400"
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
                        ? "border-l-4 border-b-2 border-red-400"
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
                        ? "border-l-4 border-b-2 border-red-400"
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
                        ? "border-l-4 border-b-2 border-red-400"
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
              </>
            ) : (
              <>
                <Link passHref href={"/Dashboard/Users/GetAllusers"}>
                  <li
                    onClick={() =>
                      handleLinkClick("/Dashboard/Users/GetAllusers")
                    }
                    className={`${
                      activeLink === "/Dashboard/Users/GetAllusers"
                        ? "border-l-4 border-b-2 border-red-400"
                        : " text-blue"
                    } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/user.png" alt="user" />
                      <span className="hidden sm:block text-sm bg-transparent text-white">
                        Users
                      </span>
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
                        ? "border-l-4 border-b-2 border-red-400"
                        : "text-blue"
                    } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/driver.png" alt="user" />
                      <span className="hidden sm:block text-sm bg-transparent text-white">
                        Driver
                      </span>
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
                        ? "border-l-4 border-b-2 border-red-400"
                        : "text-blue"
                    } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/vehicle.png" alt="user" />

                      <span className="hidden sm:block text-sm text-white bg-transparent">
                        Vehicle
                      </span>
                    </div>
                  </li>
                </Link>
                <div className="bg-transparent">
                  <li
                    onMouseEnter={() => setIsOpenManagement(true)}
                    onMouseLeave={() => setIsOpenManagement(false)}
                    className={`${
                      isOpenManagement === true
                        ? "border-l-4 border-b-2 border-red-400"
                        : "text-blue"
                    } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg relative bg-transparent`}
                  >
                    <div className="flex items-center gap-3 relative bg-transparent">
                      <img src="/setting.png" alt="user" />
                      <span className="hidden sm:block text-sm text-white bg-transparent">
                        Settings
                      </span>

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
              </>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
