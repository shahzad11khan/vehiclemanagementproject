"use client";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import { API_URL_USER } from "../Components/ApiUrl/ApiUrls";

const Page = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    useravatar: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isAuthenticated()) {
        router.push("/");
        return;
      }
      const userId = localStorage.getItem("userId");
      if (userId) {
        showAllAdmins(userId);
      }
    }
  }, []);

  const showAllAdmins = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL_USER}/${userId}`);
      const adminData = res.data.result;
      setFormData({
        username: adminData.username,
        email: adminData.email,
        password: adminData.confirmpassword, // Ensure to not expose sensitive data
        confirmpassword: adminData.confirmpassword,
        useravatar: adminData.useravatar,
      });
      setImagePreview(adminData.useravatar);
    } catch (error) {
      console.error(`Error: ${error}`);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, useravatar: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.warn("Please upload a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      toast.warn("Password and Confirm Password do not match");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) formDataToSend.append(key, formData[key]);
    });

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header className="min-w-full" />
      <div className="flex gap-4 ">
        <Sidebar />
        <main className="w-full mt-5 min-h-screen">
        <h1 className="text-[#313342] font-medium text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8">Profile</h1>
          <section>
            <div className="flex justify-center items-center m-auto bg-transparent">
              <div className="bg-transparent rounded-xl p-8 w-full mx-auto ">
                {/* <h2 className="text-2xl font-semibold mb-6 text-center">
                  Edit User
                </h2> */}
                {loading && <p>Loading...</p>}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-32 bg-transparent">
                  <div className=" flex gap-10 px-3  bg-white shadow-2xl py-5">
                    <div className=" flex items-center w-[50%] sm:w-[30%]">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="User Avatar"
                          className="object-cover object-center rounded-full"
                          width={155}
                          height={155}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                          <img
                            src="https://static.thenounproject.com/png/363639-200.png"
                            alt="Default Avatar"
                            className="w-full h-full object-cover rounded-full"
                            width={200}
                            height={200}
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-1 px-3 py-1.5 w-[50%] sm:w-[70%] rounded-md border-gray-400 border focus:outline-none focus:border-indigo-500 text-black">
                    <label className="block">
                      <span className="text-gray-950">Upload file</span>
                      <input
                        type="file"
                        className="block w-full text-sm text-gray-500 
                        file:mr-4 file:py-2 file:px-4 file:rounded-full
                        file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        id="useravatar"
                        name="useravatar"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  </div>
                  
                  <div className="w-full">
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
                        id="username"
                        name="username"
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
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative mb-4">
                      <label htmlFor="password" className="text-gray-950">
                        Password:
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="mt-1 px-3 py-1.5 w-full rounded-md border-gray-400 border focus:outline-none focus:border-indigo-500 text-black"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="relative mb-4">
                      <label
                        htmlFor="confirmpassword"
                        className="text-gray-950"
                      >
                        Confirm Password:
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmpassword"
                        name="confirmpassword"
                        className="mt-1 px-3 py-1.5 w-full rounded-md border-gray-400 border focus:outline-none focus:border-indigo-500 text-black"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                      />
                    </div>
                    <button
                      type="button"
                      className="border-2 h-10 mt-6 p-2 rounded-lg"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
                    >
                      Update User
                    </button>
                  </div>
                  </div>
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
