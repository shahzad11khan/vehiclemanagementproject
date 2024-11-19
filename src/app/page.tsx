"use client";
// import { useRouter } from "next/navigation";
import React from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Dashboard/Login/Login";
// import LoadingScreen from "./Dashboard/Components/LoadingScreen";

export default function Page() {
  return (
    <>
      <Login />
      {/* <LoadingScreen /> */}
    </>
  );
}
