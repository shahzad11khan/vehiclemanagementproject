"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL_Login } from "../Components/ApiUrl/ApiUrls";

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

      if (UserActive) {
        if (UserRole === "superadmin") {
          localStorage.setItem("token", isVerifiedtoken);
          localStorage.setItem("Userusername", Userusername);
          localStorage.setItem("companyname", companyName);
          localStorage.setItem("UserActive", UserActive);
          localStorage.setItem("role", UserRole);
          localStorage.setItem("userId", userId);
          localStorage.setItem("flag", "false");
          localStorage.setItem("Iscompanyselected", "No");
        } else {
          localStorage.setItem("token", isVerifiedtoken);
          localStorage.setItem("Userusername", Userusername);
          localStorage.setItem("UserActive", UserActive);
          localStorage.setItem("companyName", companyName);
          localStorage.setItem("role", UserRole);
          localStorage.setItem("userId", userId);
        }
        localStorage.setItem("UserActive", UserActive);
        localStorage.setItem("Userusername", Userusername);
        localStorage.setItem("companyName", companyName);
        localStorage.setItem("userId", userId);

        toast.success("Login successful");
        router.push("/Dashboard/Home");
      } else {
        toast.warning(`😢 ${response.data.error}`);
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
    <div className="min-h-screen  flex justify-center items-center">
      <form
        className="bg-transparent p-10 rounded-xl shadow-xl w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-5">
          {loading ? "Processing..." : "Vehicle Management Dashboard"}
        </h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            value={userlogin.email}
            onChange={(e) =>
              setuserlogin({ ...userlogin, email: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            value={userlogin.password}
            onChange={(e) =>
              setuserlogin({ ...userlogin, password: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          disabled={buttonDisable || loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 flex justify-end">
          <a href="/Register" className="text-blue-500 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
