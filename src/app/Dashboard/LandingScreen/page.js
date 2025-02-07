'use client'
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getAuthData, isAuthenticated } from "@/utils/verifytoken";

const Page = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      const authData = getAuthData();
      setRole(authData.role);
    } else {
      console.log("User is not authenticated");
    }
  }, []);

  return (
    <div className="min-h-screen overflow-hidden flex flex-col justify-center items-center relative bg-custom-bg">
      {/* Background Circles */}

      <div
        className="absolute -bottom-24 -left-48 w-[320px] h-[320px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] opacity-70 transform translate-y-1/4 rounded-full"
        style={{ backgroundColor: "#23397D" }}
      ></div>

      <div
        className="absolute -bottom-24 -left-48 w-[282px] h-[282px] md:w-[382px] md:h-[382px] lg:w-[492px] lg:h-[492px]  opacity-70 transform translate-y-1/4 rounded-full"
        style={{
          backgroundColor: "#244BC5",
        }}
      ></div>

      <div
        className="absolute -bottom-24 -left-48 w-[288px] h-[288px] md:w-[338px] md:h-[338px] lg:w-[438px] lg:h-[438px] opacity-70 transform translate-y-1/4 rounded-full"
        style={{
          backgroundColor: "#23397D",
        }}
      ></div>

      {/* Conditional Content */}
      {role !== "superadmin" ? (
        <>
          <div className="flex flex-col sm:flex-row bg-transparent gap-16 sm:gap-7 font-sans font-bold sm:font-medium sm:text-2xl">
            <div className=" w-28 h-28 sm:w-[170px] sm:h-[170px] bg-transparent flex flex-col items-center justify-center gap-5 ">
              <img src="/01.png" alt="Management Icon" className="w-52 h-52" />
              <Link href="/Dashboard/StartPage" className="w-full rounded-lg bg-[#EBEBEB] flex items-center justify-center">
                <button className=" py-1 sm:w-44 sm:h-11 sm:text-xl font-medium rounded-[8px]  hover:bg-blue-600 hover:text-white  transition duration-300">Management</button>
              </Link>
            </div>

            <div className=" w-28 h-28 sm:w-[170px] sm:h-[170px] bg-transparent flex flex-col items-center justify-center gap-5 ">
              <img src="/driverl.png" alt="Management Icon" className="w-full h-auto" />
              <Link href="/Dashboard/Driver/GetAllDrivers" className="w-full rounded-lg bg-[#EBEBEB] flex items-center justify-center">
                <button className=" py-1 sm:w-44 sm:h-11 sm:text-xl font-medium rounded-[8px]  hover:bg-blue-600 hover:text-white  transition duration-300">Drivers</button>
              </Link>
            </div>

            <div className=" w-28 h-28 sm:w-[170px] sm:h-[170px] bg-transparent flex flex-col items-center justify-center gap-2 ">
              <img src="/v.png" alt="Management Icon" className="w-full h-auto" />
              <Link href="/Dashboard/Vehicle/GetAllVehicle" className="w-full rounded-lg bg-[#EBEBEB] flex items-center justify-center">
                <button className=" py-1 sm:w-44 sm:h-11 sm:text-xl font-medium rounded-[8px]  hover:bg-blue-600 hover:text-white  transition duration-300">Vehicles</button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="w-6/12 border-white flex justify-center gap-4 bg-transparent">
          <div className="w-[170px] h-[170px] bg-transparent flex flex-col items-center justify-center gap-5 ">
              <img src="/01.png" alt="Management Icon" className="w-52 h-52" />
              <Link href="/Dashboard/StartPage" className="w-full rounded-lg bg-[#EBEBEB] flex items-center justify-center">
                <button className="w-44 h-11 text-xl font-medium rounded-[8px]  hover:bg-blue-600 hover:text-white  transition duration-300">Management</button>
              </Link>
            </div>
            
        </div>
      )}
    </div>
  );
};

export default Page;
