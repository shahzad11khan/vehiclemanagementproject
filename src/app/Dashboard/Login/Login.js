"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL_Login } from "../Components/ApiUrl/ApiUrls";
import LoadingScreen from "../Components/LoadingScreen";
import { isAuthenticated } from "@/utils/verifytoken";

const Login = () => {
  const router = useRouter();
  // const [buttonDisable, setbuttondisable] = useState(true);
  const [loading, setloading] = useState(false);

  const [passwordEye,setpasswordEye]=useState(true);

  const [userlogin, setuserlogin] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    // console.log(!isAuthenticated())
    if (isAuthenticated()) {
      router.push("/Dashboard/LandingScreen");
      return;
    }
  }, [router]);

   

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    

    try {
      if (!userlogin.email || !userlogin.password) {
        if (!userlogin.email && !userlogin.password) {
          toast.warn("Email and Password are required");
        } else if (!userlogin.email) {
          toast.warn("Email is required");
        } else if (!userlogin.password) {
          toast.warn("Password is required");
        }
        return;
      }
      
      const response = await axios.post(`${API_URL_Login}`, {
        email: userlogin.email,
        password: userlogin.password,
      });

      // console.log("Login successful", response);
      const isVerifiedtoken = response.data.token;
      const Userusername = response.data.username;
      const companyName = response.data.company;
      const UserActive = response.data.isActive;
      const UserRole = response.data.role;
      const userId = response.data.userId;
      const companyId = response.data.companyId;

      if (UserActive) {
        localStorage.setItem("token", isVerifiedtoken);
        localStorage.setItem("Userusername", Userusername);
        localStorage.setItem("companyName", companyName);
        localStorage.setItem("UserActive", UserActive);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", UserRole);

        if (UserRole === "superadmin") {
          localStorage.setItem("role", UserRole);
          localStorage.setItem("flag", "false");
          localStorage.setItem("Iscompanyselected", "No");
        } else {
          localStorage.setItem("companyId", companyId);
        }
        // toast.success(response.data.message);
        // router.push("/Dashboard/Home");
        router.push("/Dashboard/LandingScreen");
      } else {
        toast.warning(response.data.message);
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setloading(false);
    }
  };


  return (
    <div className="min-h-screen overflow-hidden  flex justify-center items-center relative bg-custom-bg">
      {loading && (
        <div className="absolute inset-0 bg-opacity-50 z-50 ">
          <LoadingScreen loading={loading} />
        </div>
      )}{" "}
      <img
        src="/Rightvector.png"
        alt="png"
        className="bg-transparent absolute top-0 right-0 w-[744px] h-[601px]"
      />
      <div
        className="absolute bottom-2 -left-60 w-[320px] h-[320px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] opacity-70 transform translate-y-1/4 rounded-full"
        style={{ backgroundColor: "#23397D" }}
      ></div>

      <div
        className="absolute bottom-1 -left-60 w-[282px] h-[282px] md:w-[382px] md:h-[382px] lg:w-[492px] lg:h-[492px]  opacity-70 transform translate-y-1/4 rounded-full"
        style={{
          backgroundColor: "#244BC5",
        }}
      ></div>

      <div
        className="absolute bottom-0 -left-60 w-[288px] h-[288px] md:w-[338px] md:h-[338px] lg:w-[438px] lg:h-[438px] opacity-70 transform translate-y-1/4 rounded-full"
        style={{
          backgroundColor: "#23397D",
        }}
      ></div>

      <form
        // className="bg-transparent p-10 rounded-xl -mt-32  w-[300px] h-[198px] md:w-[300px] md:h-[198px] lg:w-[300px] lg:h-[198px]"
        className="bg-transparent p-10 rounded-x absolute z-10 flex flex-col justify-between gap-5 "
        onSubmit={handleSubmit}
      >
        <div className=" text-center bg-transparent">
          <h2 className="text-3xl font-semibold font-sans mb-5 text-white bg-transparent ">
            Sign In
          </h2>
        </div>
        <div className=" relative rounded-4">
          <span className="absolute inset-y-0 left-1 top-[-2px] flex items-center p-2 bg-transparent text-white">
            {/* <FiUser className="bg-transparent font-bold text-white" style={{
              height:"20px",
              width:"20px"
            }} /> */}
            <img style={{
              height:"20px",
              width:"20px"
            }} src="./userIcon.svg"></img>
          </span>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-[300px] pl-10 pr-3 py-2 font-sans font-light border  rounded-4 bg-custom-bg  focus:outline-[1px] focus:outline-white  text-white"
            value={userlogin.email}
            onChange={(e) =>
              setuserlogin({ ...userlogin, email: e.target.value })
            }
            onInvalid={(e) => e.target.setCustomValidity("Email is required!")}
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </div>

        {/* Password Input with Icon */}
        <div className=" relative rounded-4">
          <span className="absolute inset-y-0 left-1 top-[-2px] flex items-center p-2 bg-transparent">
            {/* <FaLock className="bg-transparent" /> */}
            <img style={{
              height:"20px",
              width:"20px"
            }} src="./lockIcon.svg"></img>
          </span>
          <input
            type={`${passwordEye?"password":"text"}`}
            name="password"
            placeholder="Enter your password"
            required
          
            className="w-[300px] pl-10 pr-3 py-2 border rounded-4 font-sans font-light bg-custom-bg focus:outline-[1px] focus:outline-white  text-white"
            value={userlogin.password}
            onChange={(e) =>
              setuserlogin({ ...userlogin, password: e.target.value })
            }

            onInvalid={(e) => e.target.setCustomValidity("Password is required!")}
            onInput={(e) => e.target.setCustomValidity("")}

          />
          <button type="button"
          onClick={()=>{
            setpasswordEye(!passwordEye);
          }}
          >
        
            <img className="absolute top-[9.665px] right-3 object-cover object-center"src={`./eyeIcon${passwordEye?"On":"Off"}.svg`}></img>
            </button>
        </div>
        <div className="relative align-middle bg-transparent flex justify-end">
          <span className="  text-[13px] text-white font-normal font-montserrat bg-transparent">Forgot password?</span>
        </div>
        <button
        
          type="submit"
          onSubmit={handleSubmit}
          className="w-[300px]  font-semibold font-sans cursor-pointer text-black h-10 rounded-md hover:bg-blue-600 hover:text-white  transition duration-300 bg-white"
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default Login;
