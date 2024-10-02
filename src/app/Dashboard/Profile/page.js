"use client";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Image from "next/image";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import { API_URL_USER } from "../Components/ApiUrl/ApiUrls";

const Page = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    companyname: "",
    role: "",
    useravatar: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConformPassword, setShowConformPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if window is defined (i.e., the code is running on the client-side)
    if (typeof window !== "undefined") {
      // Check if user is authenticated
      if (!isAuthenticated()) {
        router.push("/"); // Redirect to login page if not authenticated
        return;
      }

      const userId = localStorage.getItem("userId");
      console.log(userId);

      if (userId) {
        showalladmins(userId);
      }
    }
  }, []);

  const showalladmins = async (userId) => {
    try {
      const res = await axios.get(`${API_URL_USER}/${userId}`);
      const adminData = res.data.result;
      console.log("profile", adminData);
      setFormData({
        username: adminData.username,
        email: adminData.email,
        password: adminData.confirmpassword,
        confirmpassword: adminData.confirmpassword,
        useravatar: adminData.useravatar,
      });
      setImagePreview(adminData.useravatar);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      useravatar: e.target.files[0],
    });
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      toast.warn("Password and Confirm Password do not match");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.confirmpassword);
    formDataToSend.append("confirmpassword", formData.confirmpassword);
    if (formData.useravatar) {
      formDataToSend.append("useravatar", formData.useravatar);
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(
        `${API_URL_USER}/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Admin updated successfully");
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Error updating admin");
    }
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4 ">
        <Sidebar />
        <main className="w-full mt-5 min-h-screen">
          <section>
            <div className="flex justify-center items-center m-auto">
              <div className="bg-white rounded-xl p-8 max-w-lg mx-auto shadow-xl shadow-custom-blue">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Login User
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Page Preview"
                          className="w-full h-full object-cover rounded-full"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                          <img
                            src="https://static.thenounproject.com/png/363639-200.png"
                            alt="Page Preview"
                            className="w-full h-full object-cover rounded-full"
                            width={200}
                            height={200}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 px-3 py-1.5 w-full rounded-md border-gray-400 border focus:outline-none focus:border-indigo-500 text-black">
                    <label className="block">
                      <span className="text-gray-950">Upload file</span>
                      <input
                        type="file"
                        className="mt-1 block w-full text-sm text-gray-500 
                        file:mr-4 file:py-2 file:px-4 file:rounded-full
                         file:border-0 file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        id="PageImage"
                        name="PageImage"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="UserName"
                        name="UserName"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="Email"
                        name="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <label htmlFor="Password" className="text-gray-950">
                        Password :
                      </label>
                      <br />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="Password"
                        name="Password"
                        className="mt-1 px-3 py-1.5 w-full rounded-md border-gray-400 border focus:outline-none focus:border-indigo-500 text-black"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-12 right-0 pr-3 flex items-center text-sm leading-5 text-black"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-9S17.52 3 12 3zm0 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm-2.5-5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.5c-2.5 0-4.5 2-4.5 4.5S9.5 15.5 12 15.5s4.5-2 4.5-4.5S14.5 6.5 12 6.5zM12 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 3C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-9S17.52 3 12 3zm0 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <label
                        htmlFor="ConformPassword"
                        className="text-gray-950"
                      >
                        Confirm Password :
                      </label>
                      <br />
                      <input
                        type={showConformPassword ? "text" : "password"}
                        id="ConformPassword"
                        name="ConformPassword"
                        className="mt-1 px-3 py-1.5 w-full rounded-md border-gray-400 border focus:outline-none focus:border-indigo-500 text-black"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-12 right-0 pr-3 flex items-center text-sm leading-5 text-black"
                        onClick={() =>
                          setShowConformPassword(!showConformPassword)
                        }
                      >
                        {showConformPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-9S17.52 3 12 3zm0 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm-2.5-5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.5c-2.5 0-4.5 2-4.5 4.5S9.5 15.5 12 15.5s4.5-2 4.5-4.5S14.5 6.5 12 6.5zM12 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 3C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-9S17.52 3 12 3zm0 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-4 rounded-lg shadow-md hover:bg-blue-600"
                  >
                    Update
                  </button> */}
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Page;
