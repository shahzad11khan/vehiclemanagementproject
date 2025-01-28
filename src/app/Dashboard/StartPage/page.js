"use client";
import React from "react";
import Header from "../Components/Header.js";
import Sidebar from "../Components/Sidebar.js";

const Page = () => {
  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4 ">
        <Sidebar className='h-full' />
        <main className="w-full  h-full flex flex-col items-center justify-start mt-16 gap-4">
          <h2
           className=" text-center text-xl font-bold sm:text-3xl  md:text-6xl md:font-normal font-sans mb-10 "
          // className="text-[#313342] font-medium text-6xl mb-5 underline decoration-[#AEADEB] underline-offset-4"
          >
           Welcome to Management
          </h2>
          <img
            src="/mangement.png"
            alt="Management Icon"
            className=" w-32 h-32 sm:w-44 sm:h-44 md:w-96 md:h-96 object-contain "
          />
        </main>
      </div>
    </>
  );
};

export default Page;
