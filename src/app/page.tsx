"use client";
// import { useRouter } from "next/navigation";
import React from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Dashboard/Login/Login";
// import LandingScreen from "./Dashboard/LandingScreen/page";
// import MultiSelectDropdown from "./Dashboard/Components/multipleselection";

export default function Page() {
  return (
    <>
      <Login />
      {/* <LandingScreen /> */}
      {/* <MultiSelectDropdown /> */}
    </>
  );
}
