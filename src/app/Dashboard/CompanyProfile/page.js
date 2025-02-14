"use client";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "@/utils/verifytoken";
import { useRouter } from "next/navigation";
import { API_URL_Company } from "../Components/ApiUrl/ApiUrls";

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    CompanyName: "",
    confirmPassword: "",
    image: null, // Change to null for better handling of file uploads
  });
  const [imagePreview, setImagePreview] = useState("");
  const [showConfirmPassword, setConfirmShowPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Ensure the window object is available
    if (typeof window === "undefined") return;
  
    // Redirect to home if not authenticated
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  
    // Retrieve values from localStorage
    const flag = localStorage.getItem("flag");
    const userId = localStorage.getItem("userId");
    const companyID = localStorage.getItem("companyID");
  
    // Handle showing admins
    if (flag === "true" && companyID) {
      showAllAdmins(companyID);
    } else if (userId) {
      showAllAdmins(userId);
    } else {
      console.warn("No valid user ID or company ID found in localStorage.");
    }
  }, [router]);
  

  const showAllAdmins = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL_Company}/${id}`);
      const adminData = res.data.result;
      console.log(adminData);
      setFormData({
        email: adminData.email,
        CompanyName: adminData.CompanyName,
        password: adminData.confirmPassword, // Do not set password to avoid exposing sensitive data
        confirmPassword: adminData.confirmPassword,
        image: adminData.image,
      });
      setImagePreview(adminData.image);
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
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.warn("Please upload a valid image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
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
        `${API_URL_Company}/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Company Info updated successfully");
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
      <div className="flex gap-4 w-full overflow-hidden" style={{ height: "calc(100vh - 76px)" }}>
        <Sidebar />
        <main className="w-full mt-5 overflow-auto ">
          <h1 className="text-[#313342] font-medium font-sans text-2xl mb-5 underline decoration-[#AEADEB] underline-offset-8 w-full">Profile</h1>
          <div className="py-5">
            <section className="w-[98%] bg-white rounded-[10px]">
              <div className="flex flex-col justify-between w-full drop-shadow-custom4 rounded-[10px] ">
                <div className="text-black text-center sm:text-start border-b-2 border-[#31334266] py-2 px-6 font-sans font-medium text-2xl rounded-t-[10px]">Information</div>
                <div className="bg-transparent  rounded-xl p-8 w-full mx-auto ">
                  {/* <h2 className="text-2xl font-semibold mb-6 text-center">
                  Profile
                </h2> */}
                  {loading ? (<p>Loading...</p>) : (
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10 sm:gap-20">
                      <div className=" flex justify-center">
                        <div className=" overflow-hidden relative flex items-center h-[140px] w-[140px] sm:h-[203px] sm:w-[203px] rounded-full border-2 ">
                          <input
                            type="file"
                            className="  z-50 block absolute w-full text-sm text-gray-500 
                        file:mr-4 file:py-2 file:px-4 file:rounded-full
                        file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-transparent hover:cursor-pointer bottom-0 opacity-0 right-20"
                            id="useravatar"
                            name="useravatar"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          <div className="bg-[#00000021]  flex justify-center items-center backdrop-blur-[1px] h-10 sm:h-12  absolute w-full bottom-0 border-[#FFFFFF1A] ">
                            <img src="/camera-solid.svg" className=" h-[20px] w-[20px] sm:h-[30px] sm:w-[30px] hover:cursor-pointer" ></img>
                          </div>
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
                      </div>


                      <div className="w-full  flex flex-col gap-5 sm:gap-10">
                        <div className="flex gap-6  flex-col md:flex-row">
                          <div className="w-full md:w-[50%]">
                            <label
                              className="block font-sans text-sm font-medium mb-2"
                              htmlFor="username"
                            >
                              Company Name
                            </label>
                            <input
                              type="text"
                              id="CompanyName"
                              name="CompanyName"
                              value={formData.CompanyName}
                              onChange={handleChange}
                              className=" font-sans font-medium text-sm w-full px-3 py-2 border border-[#42506666] rounded-4 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                          </div>
                          <div className=" w-full md:w-[50%]">
                            <label
                              className="block font-sans text-sm font-medium mb-2"
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
                              className="w-full px-3 py-2 border font-sans font-medium text-sm  border-[#42506666] rounded-4  focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                          </div>
                        </div>

                        <div className="flex gap-6   flex-col md:flex-row ">
                          <div className="w-full md:w-[50%] relative">
                            <label htmlFor="password" className=" block font-sans text-sm font-medium mb-2">
                              Password
                            </label>

                            <div className="relative">
                              <input
                                type={showPassword ? "password" : "text"}
                                id="password"
                                name="password"
                                className="w-full px-3 py-2 border font-sans font-medium text-sm  border-[#42506666] rounded-4  focus:outline-none focus:ring focus:ring-indigo-200"
                                value={formData.password}
                                onChange={handleChange}
                              />
                              <button type="button"
                                onClick={() => {
                                  setShowPassword(!showPassword);
                                }}
                              >

                                <img className="absolute top-[8px]  right-3 object-cover object-center" src={`/eyeIcon${showPassword ? "On" : "Off"}.svg`}></img>
                              </button>
                            </div>
                          </div>
                          <div className="w-full md:w-[50%]">
                            <label
                              htmlFor="confirmpassword"
                              className=" block font-sans text-sm font-medium mb-2"
                            >
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "password" : "text"}
                                id="confirmPassword"
                                name="confirmPassword"
                                className=" font-sans font-medium text-sm w-full px-3 py-2 border  border-[#42506666] rounded-4  focus:outline-none focus:ring focus:ring-indigo-200"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                              />
                              <button type="button"
                                onClick={() => {
                                  setConfirmShowPassword(!showConfirmPassword);
                                }}
                              >

                                <img className="absolute top-[8px]  right-3 object-cover object-center" src={`/eyeIcon${showConfirmPassword ? "On" : "Off"}.svg`}></img>
                              </button>
                            </div>
                          </div>

                        </div>
                        <div className=" w-full flex justify-center sm:justify-end ">
                          <div className=" w-full sm:w-auto flex gap-6 flex-col  sm:flex-row ">
                            <button
                              type="button"
                              onClick={() => router.back()}
                              className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
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
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
