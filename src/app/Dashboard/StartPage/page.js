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
        <main className="w-full h-full min-h-screen flex flex-col items-center justify-start mt-4 gap-4">
          <h2 className="text-2xl underline font-bold">
            Welcome to Management
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
