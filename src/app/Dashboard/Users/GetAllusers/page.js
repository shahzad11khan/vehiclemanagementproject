"use client";

import React, { useState, useEffect, } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import AddUserModel from "../AddUser/AddUserModel";
import UpdateUserModel from "../UpdateUser/UpdateUserModel";
import axios from "axios";
import { API_URL_USER } from "../../Components/ApiUrl/ApiUrls";
import { getAuthData } from "@/utils/verifytoken";
import AdminDashBDoughnut from "../../Components/AdminDashBDoughnut";

// import BackButton from "../../Components/BackButton";

import {
  getCompanyName,
  getsuperadmincompanyname,
  getUserRole,
} from "@/utils/storageUtils";

import DeleteModal from "../../Components/DeleteModal";
// import Loading from "../../Components/Loading";

const Page = () => {
  // const columns = [
  //   "Username",
  //   "Email",
  //   "Role",
  //   "Status",
  //   "Actions",
  // ];

  const [users, setUsers] = useState([]);
  const [usersX, setUsersX] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isOpenUserUpdate, setIsOpenUserUpdate] = useState(false);
  // const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);
  const [flag, setflag] = useState("");
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInActiveUsers] = useState(0);
  const [trigger, setTrigger] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const active = usersX.filter((user) => user.isActive === true).length;
    const inactive = usersX.length - active;
    setActiveUsers(active);
    setInActiveUsers(inactive);
  }, [usersX]);

  const companiesData = {
    labels: ["Inactive", "Active"],
    datasets: [
      {
        label: "User Status",
        data: [inactiveUsers, activeUsers],
        backgroundColor: ["#404CA0", "#27273AEB"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
    },
  };

  // const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setIsMounted(true);
    // const companyNameFromStorage =
    //   getCompanyName() || getsuperadmincompanyname();
    // if (companyNameFromStorage) {
    //   setSelectedCompanyName(companyNameFromStorage);
    // }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL_USER}`);
      setUsers(response.data.result);
      setFilteredData(response.data.result);
      setUsers(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    // finally{
    //   setLoading(false);
    // }
  };

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenUserUpdate(true);
  };

  const isopendeletemodel = (id) => {
    setIsDeleteModalOpenId(id); // Set the ID of the item to be deleted
    setIsDeleteModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_USER}/${id}`);
      const data = response.data;
      if (data.success) {
        setUsers((prevData) => prevData.filter((item) => item._id !== id));
        setUsersX((prevData) => prevData.filter((item) => item._id !== id));
        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((item) => item._id !== id)
        );
        // toast.success(data.message);
      } else {
        toast.warn(data.message || "Failed to delete the User.");
      }
    } catch (error) {
      console.error("Error deleting title:", error);
    }
  };

  // useEffect(() => {

  //   const userrole = getUserRole();
  //   const filtered = users.filter((item) => {
  //     // console.log(item.companyname)
  //     // console.log(selectedCompanyName)
  //     if (userrole === "superadmin") return users;
  //     const companyMatch =
  //       item &&
  //       item.companyname &&
  //       selectedCompanyName &&
  //       item.companyname.toLowerCase() === selectedCompanyName.toLowerCase();
  //     // const usernameMatch =
  //     //   item &&
  //     //   item.username &&
  //     //   item.username.toLowerCase().includes(searchTerm.toLowerCase());
  //     const usernameMatch =
  //       item.username &&
  //       searchTerm
  //         .toLowerCase()
  //         .split("")
  //         .every(
  //           (char) =>
  //             item.username.toLowerCase().includes(char) || // Check in username
  //             item.email.toLowerCase().includes(char)
  //         );
  //     return companyMatch && usernameMatch;
  //   });
  //   setFilteredData(filtered);
  // }, [searchTerm, users, selectedCompanyName]);

  //   if (loading) {
  //   return <Loading width="6" height="6" className="w-full h-auto" />;
  // }

  useEffect(() => {
    const userRole = getUserRole(); // Get the current user's role
    // console.log("role ",userRole); ??
    setRole(userRole);
    const companyName = getCompanyName() || getsuperadmincompanyname(); // Get the logged-in user's company name
    const authData = getAuthData();
    setflag(authData.flag);
    let filteredUsers = users;
    let Xusers=users;

    // Filter users based on role
    if (userRole !== "superadmin") {
      // If the user is not a superadmin, filter by company name
      filteredUsers = users.filter(
        (item) => item.companyname.toLowerCase() === companyName.toLowerCase()
      );
      Xusers = users.filter(
        (item) => item.companyname.toLowerCase() === companyName.toLowerCase()
      );
    }

    if (userRole === "superadmin" && flag === "true") {
      filteredUsers = users.filter(
        (item) => item.companyname.toLowerCase() === companyName.toLowerCase()
      );
      Xusers = users.filter(
        (item) => item.companyname.toLowerCase() === companyName.toLowerCase()
      );
    }

    // Apply search term filtering
    if (searchTerm) {
      filteredUsers = filteredUsers.filter((item) =>
        item?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Update the filtered data
    setFilteredData(filteredUsers);
    setUsersX(Xusers);
    setCurrentPage(1); // Reset to the first page on new search or filter
  }, [searchTerm, users]);

  const OpenUserModle = () => {
    setIsOpenUser(!isOpenUser);
  };

  const OpenUserUpdateModle = () => {
    setIsOpenUserUpdate(!isOpenUserUpdate);
  };

  const indexOfLastUser = currentPage * itemperpage;
  const indexOfFirstUser = indexOfLastUser - itemperpage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredData.length / itemperpage);

  if (!isMounted) {
    return null;
  }

  console.log("hehe", filteredData);

  return (
    <div className="h-[100vh] overflow-hidden">
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div
          className="w-[80%] xl:w-[85%] h-screen flex flex-col gap-4 justify-start overflow-y-auto pr-4"
          style={{
            height: "calc(100vh - 90px)",
          }}
        >
          <h1 className="text-[#313342] font-medium text-2xl py-5 underline decoration-[#AEADEB] underline-offset-8">
            {role !== "superadmin" ? "Users" : "Super Admins"}
          </h1>
          <AdminDashBDoughnut
            title="Users"
            data={companiesData}
            option={options}
          ></AdminDashBDoughnut>
          <div className="py-5">
            <div className="drop-shadow-custom4">
              {/* top */}

              <div className="flex justify-between w-full py-2 px-2">
                <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">
                  {/* Left Section - Show Entries & Search */}
                  <div className="flex justify-between gap-7 items-center">
                    {/* Show Entries Dropdown */}
                    <div className="md:flex gap-3 hidden items-center">
                      <div className="font-sans font-medium text-sm">Show</div>
                      <div>
                        <select
                          value={itemperpage}
                          onChange={(e) => {
                            setitemperpage(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="rounded-lg w-12 px-1 h-8 bg-[#E0E0E0] focus:outline-none"
                        >
                          <option disabled>0</option>
                          {Array.from({ length: 10 }, (_, i = 1) => i + 1).map(
                            (number) => (
                              <option key={number} value={number}>
                                {number}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div className="font-sans font-medium text-sm">
                        Entries
                      </div>
                    </div>

                    {/* Search Box */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src="/search.svg"
                          className="absolute left-3 top-2"
                          alt="Search Icon"
                        />
                        <input
                          type="text"
                          placeholder="Search by email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Buttons */}
                  <div className="flex gap-2">
                    {/* <BackButton /> */}
                    <button
                      onClick={OpenUserModle}
                      className="w-[102px] font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2"
                    >
                      <img src="/plus.svg" alt="Add User" />
                      Add User
                    </button>
                  </div>
                </div>
              </div>

              {/* top section ends */}

              {/* table */}

              {/* <div className="w-full  mt-4 ">
              <table className="w-full border-collapse border border-gray-200  overflow-x-auto">
                <thead>
                  <tr className="">
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="py-2 px-4 border-b text-left text-white bg-custom-bg"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers
                    .filter((user) => user.username !== "superadmin")
                    .map((user) => (
                      <tr key={user._id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">{user.username}</td>
                        <td className="py-2 px-4 border-b">{user.email}</td>
                        <td className="py-2 px-4 border-b">
                          <img
                            src={user.useravatar}
                            alt="User Avatar"
                            className="h-10 w-10 rounded-full"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          {user.isActive ? (
                            <FaCheckCircle
                              className="text-green-500"
                              title="Active"
                            />
                          ) : (
                            <FaTimesCircle
                              className="text-red-500"
                              title="Inactive"
                            />
                          )}
                        </td>
                        <td className="py-2 px-4 border-b">{user.role}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex gap-2">

                            <div className="relative group">
                              <button
                                onClick={() => handleEdit(user._id)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <img src="/edit.png" alt="edit" className="w-6" />
                              </button>

                              <div className="absolute  transform translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                Edit
                              </div>
                            </div>

                            <div className="relative group">
                              <button
                                onClick={() => isopendeletemodel(user._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <img src="/trash.png" alt="delete" className="w-6"  />
                              </button>
                              
                              <div className="absolute left-10 transform -translate-x-1/2  px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                                Delete
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div> */}
              {role !== "superadmin" ? (
                <div className=" overflow-x-auto  custom-scrollbar">
                <table className="w-full bg-white border table-auto ">
                  <thead className="font-sans font-bold text-sm text-left" >
                    <tr className="   text-white bg-[#38384A]   ">
                      <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        User Name
                      </th>
                      <th className=" py-3 px-4 min-w-[150px] md:min-w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all  overflow-hidden">Image</th>
                      <th className=" py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%]  text-white bg-custom-bg whitespace-normal break-all overflow-hidden">Email</th>
                      <th className=" py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%]  text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                        Password
                      </th>
                      <th className=" py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden ">Status</th>
                      <th className=" py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden ">Actions</th>
                    </tr>
                  </thead>
                  <tbody className=" font-sans font-medium text-sm" >
                    {currentUsers.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className=" py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">{item.username}</td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-centerr">
                          <img
                            src={item.useravatar}
                            alt="Company"
                            className="w-8 h-8 block mx-auto rounded-lg object-cover object-center"
                          />
                        </td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">{item.email}</td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden">{item.confirmpassword}</td>
                        <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] whitespace-normal break-all overflow-hidden text-center">
                           <span className="bg-[#38384A33]  px-4 py-2 rounded-[22px] text-xs">
                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                        </td>
                        <td className=" py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] whitespace-normal break-all overflow-hidden text-center">
                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={() => handleEdit(item._id)}
                              // className="text-blue-500 hover:text-blue-700"
                            >
                              <img src="/edit.png" alt="edit"  className="w-6" />
                            </button>
                            <button
                              onClick={() => isopendeletemodel(item._id)}
                              // className="text-red-500 hover:text-red-700"
                            >
                              <img src="/trash.png" alt="delete" className="w-6" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
    
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full bg-white border table-auto">
                    <thead className="font-sans font-bold text-sm text-left">
                      <tr className="text-white bg-[#38384A]">
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Username
                        </th>
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%]  text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Email
                        </th>
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center  text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Role
                        </th>
                        <th className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center  text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Status
                        </th>
                        <th className="py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] text-center text-white bg-custom-bg whitespace-normal break-all overflow-hidden">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-sans font-medium text-sm">
                      {currentUsers
                        .filter((user) => user.username !== "superadmin")
                        .map((user) => (
                          <tr key={user._id} className="border-b">
                            <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center whitespace-normal break-all overflow-hidden">
                              {user.username}
                            </td>
                            <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%]  whitespace-normal break-all overflow-hidden">
                              {user.email}
                            </td>
                            <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center  whitespace-normal break-all overflow-hidden">
                              {user.role}
                            </td>
                            <td className="py-3 px-4 min-w-[150px] w-[150px] md:w-[16.66%] text-center  whitespace-normal break-all overflow-hidden">
                              <span className="bg-[#38384A33] px-4 py-2 rounded-[22px] text-xs ">
                                {user.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 px-4 min-w-[180px] w-[180px] md:w-[16.66%] whitespace-normal break-all overflow-hidden text-center">
                              <div className="flex gap-4 justify-center">
                                <button
                                  onClick={() => handleEdit(user._id)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <img
                                    src="/edit.png"
                                    alt="edit"
                                    className="w-6"
                                  />
                                </button>
                                <button
                                  onClick={() => isopendeletemodel(user._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <img
                                    src="/trash.png"
                                    alt="delete"
                                    className="w-6"
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* table ends here */}

              {/* pagination */}

              {/* <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-l hover:bg-gray-300 cursor-pointer"
              >
                Previous
              </button>
              <span
                className={`px-3 mx-1 flex items-center justify-center rounded ${currentPage
                  ? "bg-custom-bg text-white"
                  : "bg-gray-100 hover:bg-gray-300"
                  }`}
              >
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-r hover:bg-gray-300"
              >
                Next
              </button>
            </div> */}

              <div className="flex justify-center py-5 font-montserrat font-medium text-[12px]">
                <nav>
                  <ul className="flex items-center gap-3">
                    {/* Previous Button */}
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`h-8 px-2 border rounded-lg ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      >
                        Previous
                      </button>
                    </li>

                    {/* Pagination Logic */}
                    {totalPages > 1 && (
                      <>
                        {totalPages <= 3 ? (
                          // Show all pages if total pages are 3 or fewer
                          Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                          ).map((page) => (
                            <li key={page}>
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 border rounded-lg ${
                                  currentPage === page
                                    ? "bg-custom-bg text-white"
                                    : "bg-white"
                                }`}
                              >
                                {page}
                              </button>
                            </li>
                          ))
                        ) : (
                          // Handle cases where total pages > 3
                          <>
                            {currentPage === 1 && (
                              <>
                                <li>
                                  <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                    1
                                  </button>
                                </li>
                                <li>
                                  <span className="px-2">...</span>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="h-8 w-8 border rounded-lg bg-white"
                                  >
                                    {totalPages}
                                  </button>
                                </li>
                              </>
                            )}
                            {currentPage > 1 && currentPage < totalPages && (
                              <>
                                <li>
                                  <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                    {currentPage}
                                  </button>
                                </li>
                                <li>
                                  <span className="px-2">...</span>
                                </li>
                                <li>
                                  <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="h-8 w-8 border rounded-lg bg-white"
                                  >
                                    {totalPages}
                                  </button>
                                </li>
                              </>
                            )}
                            {currentPage === totalPages && (
                              <li>
                                <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">
                                  {totalPages}
                                </button>
                              </li>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* Next Button */}
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`h-8 px-2 border rounded-lg ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "bg-white"
                        }`}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* pagination ends here */}
            </div>
          </div>
        </div>
      </div>
      <AddUserModel
        isOpen={isOpenUser}
        onClose={OpenUserModle}
        fetchData={fetchData}
        setTrigger={setTrigger}
        trigger={trigger}
      />
      <UpdateUserModel
        isOpen={isOpenUserUpdate}
        onClose={OpenUserUpdateModle}
        userId={selectedUserId}
        fetchData={fetchData}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        Id={isDeleteModalOpenId}
      />
    </div>
  );
};

export default Page;
