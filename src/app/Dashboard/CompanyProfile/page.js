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
    confirmPassword: "",
    image: null, // Change to null for better handling of file uploads
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

      const flag = localStorage.getItem("flag");
      const userId = localStorage.getItem("userId");
      const companyID = localStorage.getItem("companyID");

      if (flag === "true" && companyID) {
        showAllAdmins(companyID);
      } else if (userId) {
        showAllAdmins(userId);
      } else {
        console.warn("No valid user ID or company ID found in localStorage.");
      }
    }
  }, []);

  const showAllAdmins = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL_Company}/${id}`);
      const adminData = res.data.result;
      console.log(adminData);
      setFormData({
        email: adminData.email,
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
      <div className="flex gap-4">
        <Sidebar />
        <main className="w-full mt-5 min-h-screen">
          <section>
            <div className="flex justify-center items-center m-auto">
              <div className="bg-white rounded-xl p-8 max-w-lg mx-auto shadow-xl shadow-custom-blue">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Edit User
                </h2>
                {loading && <p>Loading...</p>} {/* Show loading state */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4 flex flex-col items-center">
                    <div className="w-24 h-24 mb-4">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="User Avatar"
                          className="w-full h-full object-cover rounded-full"
                          width={200}
                          height={200}
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
                        id="useravatar"
                        name="image" // Changed to match the state key
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <div className="flex gap-3">
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
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-sm text-black ml-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
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
                        name="confirmPassword" // Corrected to match the state key
                        className="mt-1 px-3 py-1.5 w-full rounded-md border-gray-400 border focus:outline-none focus:border-indigo-500 text-black"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
                    >
                      Update Company Info
                    </button>
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
