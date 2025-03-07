"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { getAuthData, isAuthenticated } from "@/utils/verifytoken";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [role, setrole] = useState("");
  const [flag, setflag] = useState("");

  const pathname = usePathname();

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



  const [isOpenManagement, setIsOpenManagement] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem("isOpenManagement");
      if (savedValue) {
        setIsOpenManagement(JSON.parse(savedValue));
      }
    }
  }, []);

  // Save the state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isOpenManagement", JSON.stringify(isOpenManagement));
    }
  }, [isOpenManagement]);


  const toggleValue = () => {
    setIsOpenManagement((prev) => !prev);
  };

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

  // const handleToggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  const handleCardClick = () => {
    window.location.reload();
    localStorage.setItem("flag", "false");
    localStorage.setItem("Iscompanyselected", "No");
    localStorage.removeItem("companyID");
    localStorage.removeItem("companyName");
  };
  return (
    <div className="relative h-[100%]  w-[20%] xl:[15%] ">
      {/* <button
        className="fixed top-3 left-4 z-50 block lg:hidden text-sm"
        onClick={handleToggleSidebar}
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button> */}
      {/* <aside
        className={` text-black  min-h-screen lg:w-52 w-20 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative top-0 left-0 flex flex-col shadow-2xl shadow-custom-blue `}
      > */}
      <aside
        className={`bg-white-800 text-black h-[100vh]  w-full flex flex-col relative `}
      >
        <nav
          className="flex-1  "
          style={{
            backgroundImage: "url('/bgSideBar.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <ul className="space-y-1 bg-transparent mt-5">
            <Link passHref href="/Dashboard/Home">
              <li
                onClick={() => handleLinkClick("/Dashboard/Home")}
                className={`${activeLink === "/Dashboard/Home"
                  ? " border-b-2 border-white"
                  : "text-blue "
                  } flex items-center p-3 cursor-pointer hover:border-b-2 bg-transparent mx-2`}
              >
                <div className="flex items-center gap-3 hover:text-black  bg-transparent">
                  <img src="/dashboard.png" alt="dashboard" className="w-5" />
                  <span className="hidden sm:block text-sm text-white  bg-transparent ">
                    Dashboard
                  </span>
                </div>
              </li>
            </Link>
            {role === "superadmin" && flag === "false" ? (
              <>
                {/* <Link passHref href="/Dashboard/Company/GetAllCompanies">
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
                </Link> */}
                <Link passHref href="/Dashboard/Superadmin">
                  <li
                    onClick={() => handleLinkClick("/Dashboard/Superadmin")}
                    className={`${activeLink === "/Dashboard/Superadmin"
                      ? "border-b-2"
                      : " text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 bg-transparent mx-2`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img
                        src="/register.png"
                        alt="regitstercompany"
                        className="w-5"
                      />
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
                    className={`${activeLink === "/Dashboard/Users/GetAllusers"
                      ? "border-b-2"
                      : " text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 bg-transparent mx-2`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img
                        src="/superadmin.png"
                        alt="superadmin"
                        className="w-5"
                      />

                      <span className="hidden sm:block text-sm text-white bg-transparent">
                        Super Admins
                      </span>
                    </div>
                  </li>
                </Link>

                <div className="bg-transparent">
                  <li
                    // onMouseLeave={() => setIsOpenManagement(false)}
                    // className={`${
                    //   isOpenManagement === true
                    //     ? "border-l-4 border-b-2 border-red-400"
                    //     : " text-blue"
                    // } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg relative bg-transparent`}

                    // className={`${
                    //   isOpenManagement === true
                    //     ? "border-l-4 border-b-2 border-red-400"
                    //     : " text-blue"
                    // } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg relative bg-transparent`}
                    className={`flex items-center p-3 cursor-pointer hover:border-b-2  bg-transparent ${isOpenManagement ? "border-b-2" : "text-blue"
                      } ${activeLink ===
                        "/Dashboard/Models/Manufacturer/GetManufacturers" ||
                        activeLink ===
                        "/Dashboard/Models/CarModels/GetCarsModels" ||
                        activeLink ===
                        "/Dashboard/Models/Type_BodyStyle/GetTypes" ||
                        activeLink ===
                        "/Dashboard/Models/FuelType/GetFuelTypes" ||
                        activeLink ===
                        "/Dashboard/Models/Transmission/GetTransmissions"
                        ? " border-b-2 "
                        : "text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 bg-transparent mx-2`}
                  >
                    <div className="flex items-center gap-3 relative bg-transparent w-full">
                      <div
                        className="flex bg-transparent gap-3 w-full"
                        onClick={toggleValue}
                      >
                        <img
                          src="/setting.png"
                          alt="superadmin"
                          className="w-5"
                        />
                        <p className="hidden sm:block text-sm bg-transparent text-white w-full">
                          Vehicle Settings
                        </p>
                      </div>

                      {/* ali */}
                      {isOpenManagement && (
                        <div className="absolute md:top-12  rounded-4 py-2 top-9 md:py-0 bg-[#38384A]  text-white md:bg-transparent  w-40 md:w-full z-50 ">
                          <ul className="space-y-2 pl-6 bg-transparent text-white w-full list-disc lg:marker:text-[#D9D9D9] marker:text-lg lg:marker:text-xl">
                            {[
                              {
                                path: "/Dashboard/Models/Manufacturer/GetManufacturers",
                                label: "Manufacturers",
                              },
                              {
                                path: "/Dashboard/Models/CarModels/GetCarsModels",
                                label: "Models",
                              },
                              {
                                path: "/Dashboard/Models/Type_BodyStyle/GetTypes",
                                label: "Body Type",
                              },
                              {
                                path: "/Dashboard/Models/FuelType/GetFuelTypes",
                                label: "Fuel Type",
                              },
                              {
                                path: "/Dashboard/Models/Transmission/GetTransmissions",
                                label: "Transmission Type",
                              },
                            ].map((item) => (
                              <li
                                key={item.path}
                                className=" font-medium  text-xs lg:text-sm w-full bg-transparent text-white"
                              >
                                <Link
                                  href={item.path}
                                  className={`w-full block bg-transparent ${pathname === item.path
                                    ? "opacity-100"
                                    : "opacity-65"
                                    }`}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
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
                  <li
                    className={`${activeLink === "/Dashboard/Home"
                      ? "border-b-2"
                      : " text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 bg-transparent mx-2`}
                  >
                    <div
                      className="flex items-center gap-3 bg-transparent"
                      onClick={handleCardClick}
                    >
                      <IoIosArrowBack className="text-white text-sm bg-transparent" />
                      <span className="hidden sm:block bg-transparent text-white">
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
                    className={`${activeLink === "/Dashboard/Users/GetAllusers"
                      ? "border-b-2"
                      : " text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 bg-transparent mx-2`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/user.png" alt="user" className="w-5" />
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
                    className={`${activeLink === "/Dashboard/Driver/GetAllDrivers"
                      ? "border-b-2"
                      : " text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 bg-transparent mx-2`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/driver.png" alt="user" className="w-5" />
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
                    className={`${activeLink === "/Dashboard/Vehicle/GetAllVehicle"
                      ? "border-b-2"
                      : " text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 bg-transparent mx-2`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/driver.png" alt="user" className="w-5" />

                      <span className="hidden sm:block text-sm bg-transparent text-white">
                        Vehicle
                      </span>
                    </div>
                  </li>
                </Link>

                <div className="bg-transparent w-full">
                  <li
                    // onClick={() => setIsOpenManagement(false)}
                    // className={`${
                    //   isOpenManagement === true
                    //     ? "border-l-4 border-b-2 border-red-400"
                    //     : " text-blue"
                    // } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg relative bg-transparent`}
                    className={`flex items-center p-3 cursor-pointer hover:border-b-2  bg-transparent ${isOpenManagement
                      ? " border-b-2 "
                      : "text-blue"
                      } ${activeLink ===
                        "/Dashboard/Models/Manufacturer/GetManufacturers" ||
                        activeLink ===
                        "/Dashboard/Models/CarModels/GetCarsModels" ||
                        activeLink === "/Dashboard/Models/Enquiry/GetEnquiries" ||
                        activeLink === "/Dashboard/Models/Firm/GetFirms" ||
                        activeLink ===
                        "/Dashboard/Models/Signature/GetSignatures" ||
                        activeLink ===
                        "/Dashboard/Models/LocalAuthority/GetLocalAuthority" ||
                        activeLink ===
                        "/Dashboard/Models/Supplier/GetSuppliers" ||
                        activeLink ===
                        "/Dashboard/Models/Insurance/GetInsurances" ||
                        activeLink ===
                        "/Dashboard/Models/Type_BodyStyle/GetTypes" ||
                        activeLink ===
                        "/Dashboard/Models/FuelType/GetFuelTypes" ||
                        activeLink ===
                        "/Dashboard/Models/Transmission/GetTransmissions"
                        ? "border-l-4 border-b-2 border-red-400"
                        : "text-blue"
                      }`}
                  >
                    <div className="flex  items-center gap-3 relative bg-transparent w-full"
                      onClick={toggleValue}
                    >

                      <img
                        src="/setting.png"
                        alt="superadmin"
                        className="w-5"
                      />

                      <p
                        className="hidden sm:block text-sm bg-transparent text-white w-full"
                        onClick={toggleValue}
                      >
                        Settings
                      </p>
                      <div />
                      {isOpenManagement && (
                        <div className="absolute h-[30vh] md:top-12 custom-scrollbar  rounded-4 py-2 top-9 md:py-0 bg-[#38384A] text-white md:bg-transparent w-40  md:w-full z-50">
                          <ul className="space-y-2 pl-6 bg-transparent text-white w-full list-disc lg:marker:text-[#D9D9D9] marker:text-lg lg:marker:text-xl">
                            {[
                              {
                                path: "/Dashboard/Models/Manufacturer/GetManufacturers",
                                label: "Manufacturers",
                              },
                              {
                                path: "/Dashboard/Models/CarModels/GetCarsModels",
                                label: "Models",
                              },
                              {
                                path: "/Dashboard/Models/Type_BodyStyle/GetTypes",
                                label: "Body Type",
                              },
                              {
                                path: "/Dashboard/Models/FuelType/GetFuelTypes",
                                label: "Fuel Type",
                              },
                              {
                                path: "/Dashboard/Models/Transmission/GetTransmissions",
                                label: "Transmission Type",
                              },
                              {
                                path: "/Dashboard/Models/VehicleType/GetVehicleTypes",
                                label: "Vehicle Types",
                              },
                              {
                                path: "/Dashboard/Models/Enquiry/GetEnquiries",
                                label: "Enquiries",
                              },
                              {
                                path: "/Dashboard/Models/Firm/GetFirms",
                                label: "Firms",
                              },
                              {
                                path: "/Dashboard/Models/Signature/GetSignatures",
                                label: "Signatures",
                              },
                              {
                                path: "/Dashboard/Models/LocalAuthority/GetLocalAuthority",
                                label: "Local Authority",
                              },
                              {
                                path: "/Dashboard/Models/Supplier/GetSuppliers",
                                label: "Suppliers",
                              },
                              {
                                path: "/Dashboard/Models/Insurance/GetInsurances",
                                label: "Insurances",
                              },
                            ].map((item) => (
                              <li
                                key={item.path}
                                className="font-medium text-xs lg:text-sm w-full bg-transparent text-white"
                              >
                                <Link
                                  href={item.path}
                                  className={`w-full block bg-transparent ${pathname === item.path
                                    ? "opacity-100"
                                    : "opacity-65"
                                    }`}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
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
                    className={`${activeLink === "/Dashboard/Users/GetAllusers"
                      ? " border-b-2 border-white"
                      : " text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2  mx-2 bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/user.png" alt="user" className="w-5" />
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
                    className={`${activeLink === "/Dashboard/Driver/GetAllDrivers"
                      ? "border-b-2 border-white"
                      : "text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 mx-2 bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/driver.png" alt="user" className="w-5" />
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
                    className={`${activeLink === "/Dashboard/Vehicle/GetAllVehicle"
                      ? " border-b-2 border-white"
                      : "text-blue"
                      } flex items-center p-3 cursor-pointer hover:border-b-2 mx-2 bg-transparent`}
                  >
                    <div className="flex items-center gap-3 bg-transparent">
                      <img src="/vehicle.png" alt="user" className="w-5" />

                      <span className="hidden sm:block text-sm text-white bg-transparent">
                        Vehicle
                      </span>
                    </div>
                  </li>
                </Link>
                <div className="bg-transparent">
                  <li
                    // onMouseLeave={() => setIsOpenManagement(false)}
                    // className={`${
                    //   isOpenManagement === true
                    //     ? "border-l-4 border-b-2 border-red-400"
                    //     : " text-blue"
                    // } flex items-center p-3 cursor-pointer hover:border-b-2 rounded-lg relative bg-transparent`}
                    className={`flex items-center p-3 cursor-pointer hover:border-b-2 mx-2 bg-transparent ${isOpenManagement ? "border-b-2 border-white" : "text-blue"
                      } ${activeLink ===
                        "/Dashboard/Models/Manufacturer/GetManufacturers" ||
                        activeLink ===
                        "/Dashboard/Models/CarModels/GetCarsModels" ||
                        activeLink === "/Dashboard/Models/Enquiry/GetEnquiries" ||
                        activeLink === "/Dashboard/Models/Firm/GetFirms" ||
                        activeLink ===
                        "/Dashboard/Models/Signature/GetSignatures" ||
                        activeLink ===
                        "/Dashboard/Models/LocalAuthority/GetLocalAuthority" ||
                        activeLink ===
                        "/Dashboard/Models/Supplier/GetSuppliers" ||
                        activeLink ===
                        "/Dashboard/Models/Insurance/GetInsurances" ||
                        activeLink ===
                        "/Dashboard/Models/Type_BodyStyle/GetTypes" ||
                        activeLink ===
                        "/Dashboard/Models/FuelType/GetFuelTypes" ||
                        activeLink ===
                        "/Dashboard/Models/Transmission/GetTransmissions" || activeLink === "/Dashboard/Models/DriverBalance/GetDriverBalance" ||
                        activeLink === "/Dashboard/Models/DriverCars/GetDriverCars" ||
                        activeLink === "/Dashboard/Models/DriverPayments/GetDriverPayments"

                        ? " border-b-2 border-white"
                        : "text-blue"
                      }`}
                  >
                    <div className="flex items-center gap-3 relative bg-transparent w-full"
                      onClick={toggleValue}
                    >
                      <img
                        src="/setting.png"
                        alt="superadmin"
                        className="w-5"
                      />

                      <p
                        className="hidden sm:block text-sm bg-transparent text-white"

                      >
                        Settings
                      </p>

                      {isOpenManagement && (
                        <div className="absolute h-[30vh] md:top-12 custom-scrollbar  rounded-4 py-2 top-9 md:py-0 bg-[#38384A] text-white md:bg-transparent w-40  md:w-full z-50">
                          <ul className="space-y-2 pl-6 bg-transparent text-white w-full list-disc lg:marker:text-[#D9D9D9] marker:text-lg lg:marker:text-xl">
                            {[


                              {
                                // path: "/Dashboard/Models/DriverBalance/GetDriverBalance",
                                path: "/Dashboard/Models/DriverBalance/GetAllDrivers  ",
                                label: "Balance",
                              },
                              {
                                path: "/Dashboard/Models/DriverCars/GetDriverCars",
                                label: "Cars",
                              },
                              {
                                path: "/Dashboard/Models/DriverPayments/GetDriverPayments",
                                label: "Payments",
                              },




                              {
                                path: "/Dashboard/Models/Manufacturer/GetManufacturers",
                                label: "Manufacturers",
                              },
                              {
                                path: "/Dashboard/Models/CarModels/GetCarsModels",
                                label: "Models",
                              },
                              {
                                path: "/Dashboard/Models/Type_BodyStyle/GetTypes",
                                label: "Body Type",
                              },
                              {
                                path: "/Dashboard/Models/FuelType/GetFuelTypes",
                                label: "Fuel Type",
                              },
                              {
                                path: "/Dashboard/Models/Transmission/GetTransmissions",
                                label: "Transmission Type",
                              },
                              {
                                path: "/Dashboard/Models/VehicleType/GetVehicleTypes",
                                label: "Vehicle Types",
                              },
                              {
                                path: "/Dashboard/Models/Enquiry/GetEnquiries",
                                label: "Enquiries",
                              },
                              {
                                path: "/Dashboard/Models/Firm/GetFirms",
                                label: "Firms",
                              },
                              {
                                path: "/Dashboard/Models/Signature/GetSignatures",
                                label: "Signatures",
                              },
                              {
                                path: "/Dashboard/Models/LocalAuthority/GetLocalAuthority",
                                label: "Local Authority",
                              },
                              {
                                path: "/Dashboard/Models/Supplier/GetSuppliers",
                                label: "Suppliers",
                              },
                              {
                                path: "/Dashboard/Models/Insurance/GetInsurances",
                                label: "Insurances",
                              },
                            ].map((item) => (
                              <li
                                key={item.path}
                                className="font-medium text-xs lg:text-sm w-full bg-transparent text-white"
                              >
                                <Link
                                  href={item.path}
                                  className={`w-full block bg-transparent ${pathname === item.path
                                    ? "opacity-100"
                                    : "opacity-65"
                                    }`}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
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