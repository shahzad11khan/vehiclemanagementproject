"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL_Login } from "../Components/ApiUrl/ApiUrls";
import { FaEnvelope, FaLock } from "react-icons/fa";
import LoadingScreen from "../Components/LoadingScreen";

const Login = () => {
  const [userlogin, setuserlogin] = useState({
    email: "",
    password: "",
  });
  const [buttonDisable, setbuttondisable] = useState(true);
  const [loading, setloading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const response = await axios.post(`${API_URL_Login}`, {
        email: userlogin.email,
        password: userlogin.password,
      });

      console.log("Login successful", response);
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
        router.push("/Dashboard/Home");
      } else {
        toast.warning(response.data.error);
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (userlogin.email.length > 0 && userlogin.password.length > 0) {
      setbuttondisable(false);
    } else {
      setbuttondisable(true);
    }
  }, [userlogin]);

  return (
    <div className="min-h-screen overflow-hidden  flex justify-center items-center relativ bg-custom-bg">
      {loading && (
        <div className="absolute inset-0 bg-opacity-50 z-50 ">
          <LoadingScreen loading={loading} />
        </div>
      )}
      {/* <div className="absolute top-0 right-0    opacity-70 transform -translate-y-1/4"> */}
      {/* <img src="/Vectorright.png" className="top-0 right-0 absolute" /> */}
      {/* </div> */}

      <div
        className="absolute bottom-0 -left-40 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] opacity-70 transform translate-y-1/4 rounded-full"
        style={{ backgroundColor: "#23397D" }}
      ></div>
      <div
        className="absolute bottom-0 -left-40 w-[272px] h-[272px] md:w-[372px] md:h-[372px] lg:w-[472px] lg:h-[472px]  opacity-70 transform translate-y-1/4 rounded-full"
        style={{
          backgroundColor: "#244BC5",
        }}
      ></div>
      <div
        className="absolute bottom-0 -left-40 w-[288px] h-[288px] md:w-[338px] md:h-[338px] lg:w-[438px] lg:h-[438px] opacity-70 transform translate-y-1/4 rounded-full"
        style={{
          backgroundColor: "#23397D",
        }}
      ></div>
      <form
        className="bg-transparent p-10 rounded-xl -mt-32  w-[300px] h-[198px] md:w-[300px] md:h-[198px] lg:w-[300px] lg:h-[198px]"
        onSubmit={handleSubmit}
      >
        <div className=" text-center bg-transparent">
          <h2 className="text-2xl font-bold mb-5  text-white bg-transparent ">
            Sign In
          </h2>
        </div>
        <div className="mb-6 relative">
          <span className="absolute inset-y-0 left-2 flex items-center p-2 bg-transparent">
            <FaEnvelope className="bg-transparent" />
          </span>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full pl-10 pr-3 py-2 border focus:outline-none  bg-custom-bg text-white"
            value={userlogin.email}
            onChange={(e) =>
              setuserlogin({ ...userlogin, email: e.target.value })
            }
          />
        </div>

        {/* Password Input with Icon */}
        <div className="mb-6 relative">
          <span className="absolute inset-y-0 left-2 flex items-center p-2 bg-transparent">
            <FaLock className="bg-transparent" />
          </span>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="w-full pl-10 pr-3 py-2 border bg-custom-bg text-white"
            value={userlogin.password}
            onChange={(e) =>
              setuserlogin({ ...userlogin, password: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="w-full  text-black py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 bg-white"
          disabled={buttonDisable || loading}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
