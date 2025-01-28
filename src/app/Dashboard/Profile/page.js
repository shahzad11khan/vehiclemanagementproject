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
      <div className="flex gap-4 w-full ">
        <Sidebar />
        <main className="w-full mt-5 min-h-screen">
        <h1 className="text-[#313342] font-medium text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8 w-full">Profile</h1>

          <section className="w-[98%] bg-white">
            <div className="flex flex-col justify-between w-full drop-shadow-custom4 rounded-[10px] ">
              <div className="text-black  border-b-2 border-[#31334266] py-2 px-6 font-sans font-medium text-2xl">Information</div>
              <div className="bg-transparent  rounded-xl p-8 w-full mx-auto ">
                {/* <h2 className="text-2xl font-semibold mb-6 text-center">
                  Edit User
                </h2> */}
                {loading && <p>Loading...</p>}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-20">
                    {/* image */}
                  <div className=" flex justify-center">
                    <div className=" flex items-center h-[140px] w-[140px] sm:h-[203px] sm:w-[203px] rounded-full border-2 border-black">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="User Avatar"
                          className="object-cover object-center rounded-full h-[100%] w-[100%]"
                        />
                      ) : (
                          <img
                            src="https://static.thenounproject.com/png/363639-200.png"
                            alt="Default Avatar"
                            className="object-cover object-center rounded-full h-[100%] w-[100%]"
                          />
                      )}
                    </div>
                    {/* <div className="mt-1 px-3 py-1.5 w-[50%] sm:w-[70%] rounded-md border-gray-400 border focus:outline-none focus:border-indigo-500 text-black">
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
                  </div> */}
                  </div>
                  
                  {/* input fields */}
                  <div className="w-full  flex flex-col gap-10">
                  <div className="flex gap-3  flex-col md:flex-row">
                    <div className="w-full md:w-[50%]">
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
                        className="w-full px-3 py-2 border border-[#42506666] rounded-4 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                    <div className=" w-full md:w-[50%]">
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
                        className="w-full px-3 py-2 border  border-[#42506666] rounded-4  focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3  flex-col md:flex-row">
                    <div className="w-full md:w-[50%]">
                      <label htmlFor="password" className="text-gray-950">
                        Password:
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="w-full px-3 py-2 border  border-[#42506666] rounded-4  focus:outline-none focus:ring focus:ring-indigo-200"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="w-full md:w-[50%]">
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
                        className="w-full px-3 py-2 border  border-[#42506666] rounded-4  focus:outline-none focus:ring focus:ring-indigo-200"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                      />
                    </div>
                    {/* <button
                      type="button"
                      className="border-2 h-10 mt-6 p-2 rounded-lg"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button> */}
                  </div>
                  <div className=" w-full flex justify-center sm:justify-end ">
                    <div className=" w-full sm:w-auto flex gap-6 flex-col  sm:flex-row ">
                    <button className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
                    >Cancel</button>
                    <button
                      type="submit"
                      className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
                    >
                     Save
                    </button>
                    </div>
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
