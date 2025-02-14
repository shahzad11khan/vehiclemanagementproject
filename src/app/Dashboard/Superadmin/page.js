"use client";
import React from "react";
import Header from "../Components/Header.js";
import Sidebar from "../Components/Sidebar.js";
import AllCompnaies from "../Components/AllCompnaies";

const page = () => {
  return (
    <>
      <div className="h-[100vh] overflow-hidden">
        <Header className="min-w-full" />
        <div className="flex gap-4">
          <Sidebar />
          <main className=" w-[80%] xl:w-[85%] min-h-screen">
            <AllCompnaies />
          </main>
        </div>
      </div>
    </>
  );
};

export default page;
