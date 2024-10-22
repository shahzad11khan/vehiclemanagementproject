import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { getAuthData } from "@/utils/verifytoken";

const HeroSection = () => {
  const [superadmin, setsuperadmin] = useState("");
  const [flag, setflag] = useState("");

  useEffect(() => {
    const authData = getAuthData();
    setsuperadmin(authData.role);
    setflag(authData.flag);
  }, []);

  const waveData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Wave Data",
        data: [65, 59, 80, 81, 90],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const donutData = {
    labels: ["Cars on Hire", "Cars in Repair", "Cars Waiting to Go on Hire"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="flex space-x-4 flex-col sm:flex-row pb-5">
      <div className="flex-1 p-4 rounded-md shadow-sm shadow-custom-blue h-[260px]">
        <h2 className="text-lg font-semibold mb-2">Data</h2>
        <ul className="ml-5 list-none">
          <li>
            <strong className="text-xl">Total Number Of Cars</strong>
            <span className="ml-1 text-sm block">
              {superadmin === "superadmin" && flag === "false"
                ? "Rented Cars Is  :"
                : "The Total Number of Car Is  :"}
            </span>
          </li>
          <li>
            <strong className="text-xl">0</strong>
            <span className="ml-1 text-sm block">
              {superadmin === "superadmin" && flag === "true"
                ? "Rented Cars Is  :"
                : "The Total Number of Car Is  :"}
            </span>
          </li>
          <li>
            <strong className="text-xl">0</strong>
            {/* <span className="ml-1 text-sm block">
              {(superadmin === "superadmin" && flag === "false") ||
              flag === "false"
                ? "Active cars"
                : "Active cars"}
            </span> */}
          </li>
          <button className="mt-4 px-4 py-2 bg-rose-400 text-white rounded-md shadow">
            View Details
          </button>
        </ul>
      </div>

      <div className="flex-1 p-4 rounded-md shadow-sm shadow-custom-blue h-[260px]">
        <h2 className="text-lg font-semibold mb-2">Graph</h2>
        <Line data={waveData} options={{ responsive: true }} />
      </div>

      <div className="flex-1 p-4 rounded-md shadow-sm shadow-custom-blue h-[260px]">
        <h2 className="text-lg font-semibold mb-2">Car Details</h2>
        <div className="h-48">
          <Doughnut data={donutData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
