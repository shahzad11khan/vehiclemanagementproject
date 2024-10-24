"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { getAuthData, isAuthenticated } from "@/utils/verifytoken";
import { GetVehicle } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas.js";

const HeroSection = () => {
  const [superadmin, setsuperadmin] = useState("");
  const [companyname, setcompnayname] = useState("");
  const [availableCar, setavailablecar] = useState(0);
  const [rent, setRentcar] = useState(0);
  const [flag, setflag] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      const authData = getAuthData();
      setsuperadmin(authData.role);
      setflag(authData.flag);
      setcompnayname(authData.companyName);
    } else {
      router.push("/");
      return;
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      let vehicleData = await GetVehicle();
      console.log(vehicleData); // Log the fetched vehicle data

      // Initialize counters
      let availableCar = 0;
      let rentCar = 0;

      // Check if vehicleData is empty
      if (!vehicleData.result || vehicleData.result.length === 0) {
        // Set counts to zero if no vehicles are available
        setavailablecar(0);
        setRentcar(0);
        return; // Exit early if there are no vehicles
      }

      // Iterate through vehicle data
      vehicleData.result.forEach((vehicle) => {
        console.log(vehicle); // Log each vehicle

        // If super admin, count all vehicles; if regular admin, check company name
        if (
          superadmin === "superadmin" ||
          vehicle.adminCompanyName === companyname
        ) {
          // Update the respective counters based on vehicle status
          switch (vehicle.vehicleStatus) {
            case "Available":
              availableCar++;
              break;
            case "Rent":
              rentCar++;
              break;
            default:
              break; // Handle unknown status, if any
          }
        }
      });

      // Update state with the final counts
      setavailablecar(availableCar);
      setRentcar(rentCar);
    } catch (error) {
      console.log(`Failed to fetch data: ${error}`);
    }
  }, [companyname, superadmin]);
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);
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
              The Total Number of Car Is :
            </span>
          </li>
          <li>
            <strong className="text-xl">
              {superadmin === "superadmin" && flag === "false"
                ? availableCar
                : superadmin === "superadmin" && flag === "true"
                ? availableCar
                : availableCar}
            </strong>
            <span className="ml-1 text-sm block">Rented Cars Is :</span>
          </li>
          <li>
            <strong className="text-xl">
              {superadmin === "superadmin" && flag === "false"
                ? rent
                : superadmin === "superadmin" && flag === "true"
                ? rent
                : rent}
            </strong>
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
