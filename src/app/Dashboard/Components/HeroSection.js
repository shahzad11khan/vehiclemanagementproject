"use client";
import AdminDashBDoughnut from "../Components/AdminDashBDoughnut.jsx"
import React, {
  useState,
  // useCallback  ,
  useEffect,
} from "react";
import { Bar } from "react-chartjs-2";
// import { Doughnut } from "react-chartjs-2";
import {
  // getAuthData,
  isAuthenticated,
} from "@/utils/verifytoken";
// import { GetVehicle } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas.js";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const HeroSection = ({TotalCar,carsOnRent}) => {
  const router = useRouter();
  // const [superadmin, setsuperadmin] = useState("");
  // const [companyname, setcompnayname] = useState("");
  // const [totalCar, setTotalcar] = useState(0);
  // const [rent, setRentcar] = useState(0);
  // const [flag, setflag] = useState("");
  const [timeRange, setTimeRange] = useState("weekly"); // Default time range

  useEffect(() => {
    if (isAuthenticated()) {
      // const authData = getAuthData();
      // setsuperadmin(authData.role);
      // setflag(authData.flag);
      // setcompnayname(authData.companyName);
    } else {
      router.push("/");
      return;
    }
  }, []);

  // const fetchCounts = useCallback(async () => {
  //   try {
  //     let vehicleData = await GetVehicle();

  //     // Initialize counters
  //     let rentCar = 0;

  //     // Set total car count if available
  //     if (vehicleData.count) {
  //       setTotalcar(vehicleData.count);
  //     }

  //     // If no vehicles are available, reset counts and return early
  //     if (!vehicleData.result?.length) {
  //       setRentcar(0);
  //       return;
  //     }

  //     // Iterate through vehicle data
  //     vehicleData.result.forEach((vehicle) => {
  //       // Check if super admin or adminCompanyName matches
  //       if (
  //         superadmin === "superadmin" ||
  //         vehicle.adminCompanyName === companyname
  //       ) {
  //         if (vehicle.vehicleStatus === "Rent") {
  //           rentCar++;
  //         }
  //       }
  //     });

  //     // Update the Rent car count
  //     setRentcar(rentCar);
  //   } catch (error) {
  //     console.error(`Failed to fetch data: ${error}`);
  //   }
  // }, [companyname, superadmin]);

  // Automatically fetch counts on component mount or dependency change
  // useEffect(() => {
  //   fetchCounts();
  // }, [fetchCounts]);

  // const waveData = {
  //   labels: ["January", "February", "March", "April", "May"],
  //   datasets: [
  //     {
  //       label: "Wave Data",
  //       data: [65, 59, 80, 81, 90],
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       backgroundColor: "rgba(75, 192, 192, 0.2)",
  //     },
  //   ],
  // };

  // const donutData = {
  //   labels: ["Cars on Hire", "Cars in Repair", "Cars Waiting to Go on Hire"],
  //   datasets: [
  //     {
  //       data: [300, 50, 100],
  //       backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
  //       hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
  //     },
  //   ],
  // };

  // Dummy data for different time ranges
  const chartData = {
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Weekly Data",
          data: [12, 30, 3, 5, 2, 3, 7],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    monthly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Monthly Data",
          data: [30, 50, 70, 20],
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    yearly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Yearly Data",
          data: [120, 190, 300, 500, 200, 300, 400, 100, 150, 250, 300, 450],
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
      ],
    },
  };

  

  const carsDetails={
    labels:["Hired Cars","Ready for Hiring","Cars in Repair"],
    datasets:[
        {
        label:"Cars Status",
        data:[5,20,10],
        backgroundColor:["#7483F3","#404CA0","#27273AEB"],
        borderWidth:1
        },
    ]
};

const Data={
  labels:["Total Number of cars","Rented Cars"],
    datasets:[
        {
        label:"Cars Status",
        data:[TotalCar,carsOnRent],
        backgroundColor:["#27273AEB","#404CA0"],
        borderWidth:1
        },
    ]
};
  
const options={
    responsive:true,
    plugins: {
        legend: {
          display: false, // Hide the default legend
        },
}
}

  return (
    <>
      {/* <h1 className="text-[#313342] font-medium text-2xl mb-5 underline">Dashboard</h1> */}
      <h1 className="text-[#313342] font-medium text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8">Dashboard</h1>
        {/* <div className="flex-1 p-4 rounded-md shadow-sm shadow-custom-blue h-[260px]">
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
                ? totalCar
                : superadmin === "superadmin" && flag === "true"
                ? totalCar
                : totalCar}
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
      </div> */}
        {/* <div className="flex flex-col p-4 rounded-lg shadow-sm outline-none shadow-custom-blue w-[333px] h-[310px] ">
          <h3 className="text-lg font-semibold mb-2">Car Details</h3>
          <div className="flex items-center justify-center mt-6">
            <div className="w-[156.01px] h-[156.28px] ">
              <img src="/ahhhahhhahh.png" />
              <img src="/values.png" className="mt-2 h-[40px] w-[210px]" />
            </div>
          </div>
        </div> */}
         <div className="flex w-full  gap-10 flex-wrap">
                  <AdminDashBDoughnut  title="Car Details" data={carsDetails} option={options} extra={"Car Deatils"}  ></AdminDashBDoughnut>
                <div className="flex flex-col h-[310px] sm:h-[250px] md:h-auto sm:max-w-[386px] max-w-full w-full drop-shadow-custom3 rounded-[10px] bg-white justify-between">
                  <div className="flex justify-between py-2 sm:py-3 px-3 items-center rounded-[10px]">
                      <h3 className="text-base sm:text-lg font-semibold">Statistics</h3>
                      <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="rounded-2xl px-2 text-xs sm:text-sm outline-none bg-[#F8F8FF] w-[80px] sm:w-[91px] h-[28px] sm:h-[30px]"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                  </div>
                  <div className="flex items-center justify-center px-2 sm:px-3 py-2 sm:py-3 rounded-[10px]">
                      <Bar data={chartData[timeRange]} options={options} />
                  </div>
                </div>


        <AdminDashBDoughnut title="Data" data={Data} option={options} extra={"Data"}  ></AdminDashBDoughnut>
                  </div>
        

        
    </>
  );
};

export default HeroSection;
