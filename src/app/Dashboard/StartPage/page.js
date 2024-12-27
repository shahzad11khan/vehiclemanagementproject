"use client";
import React from "react";
import Header from "../Components/Header.js";
import Sidebar from "../Components/Sidebar.js";

const Page = () => {
  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4 ">
        <Sidebar />
        <main className="w-full  h-screen flex flex-col items-center justify-start mt-16 gap-4">
          <h2
           className="text-6xl underline font-light mb-10 underline-offset-8"
          // className="text-[#313342] font-medium text-6xl mb-5 underline decoration-[#AEADEB] underline-offset-4"
          >
            Welcome to <span className="font-medium">Management</span>
          </h2>
          <img
            src="/mangement.png"
            alt="Management Icon"
            className="w-96 h-96 object-contain "
          />
        </main>
      </div>
    </>
  );
};

export default Page;
