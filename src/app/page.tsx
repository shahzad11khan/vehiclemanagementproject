"use client";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import React from "react";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex justify-center items-center">
      <form className="bg-transparent p-10 rounded-xl shadow-xl w-96">
        {/* Image on the top */}
        <div className="flex justify-center mb-5">
          <Image
            src="/path-to-your-image.jpg" // Replace with your image path
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        {/* Form Title */}
        <h2 className="text-3xl font-bold mb-5">Encoderbytes Dashboard</h2>

        {/* Email Input */}
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
          />
        </div>

        {/* Password Input */}
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
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>

        {/* Register Link */}
        <div className="mt-4 flex justify-end">
          <a href="/Register" className="text-blue-500 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}
