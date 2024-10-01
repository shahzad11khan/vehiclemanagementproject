"use client";
import React from "react";
import Header from "../Components/Header.js";
import Sidebar from "../Components/Sidebar.js";
import AllCompnaies from "../Components/AllCompnaies";

const page = () => {
  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4 ">
        <Sidebar />
        <main className="w-full mt-5 min-h-screen">
          <AllCompnaies />
        </main>
      </div>
    </>
  );
};

export default page;
