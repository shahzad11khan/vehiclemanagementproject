"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import Sidebar from "../../../Components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddCarModel from "../AddCarModel/AddCarmodel";
import UpdateCarModel from "../UpdateCarModel/UpdateCarModel";
import axios from "axios";
import { API_URL_CarModel } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import { GetCarModel } from "@/app/Dashboard/Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { getCompanyName, getsuperadmincompanyname,getUserName } from "@/utils/storageUtils";
import DeleteModal from "../../../Components/DeleteModal";


const Page = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersearch, setSearchfilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpenBadge, setIsOpenBadge] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isOpenVehicleUpdate, setIsOpenVehicleUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemperpage, setitemperpage] = useState(5);
  const [totalPages,setTotalPages]=useState(0);
  const [dataToBeFetched,setDataToBeFetched]=useState([]);

  const [selectedModel, setSelectedModel] = useState('');
  const [showFilter, setShowFilter] = useState(false);
    // Get a list of unique models for the filter options
    const models = [...new Set(data.map(item => item.makemodel))];

    const [selectedModell, setSelectedModell] = useState(models);
    const [dataToBeFetchedManufacturer,setDataToBeFetchedManufacturer]=useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteModalOpenId, setIsDeleteModalOpenId] = useState(null);

    const isopendeletemodel = (id) => {
      setIsDeleteModalOpenId(id); // Set the ID of the item to be deleted
      setIsDeleteModalOpen(true); // Open the modal
    };

    useEffect(()=>{
      if(selectedModel){
      const filtered = selectedModel
    ? data.filter(item => item.makemodel === selectedModel)
    : data;
     setDataToBeFetchedManufacturer(filtered);
      }
      else{
        setDataToBeFetchedManufacturer([]);
      }
    },[selectedModel])
    

    const handleFilterChange = (model) => {
      setSelectedModel(model);
      setShowFilter(false); // Hide the filter dropdown after selection
    };

  useEffect(() => {
    setIsMounted(true);
    const companyNameFromStorage = (() => {
      const name1 = getCompanyName();
      if (name1) return name1;
    
      const name2 = getUserName();
      if (name2) return name2;
    
      const name3 = getsuperadmincompanyname();
      return name3;
    })();
    if (companyNameFromStorage) {
      setSelectedCompanyName(companyNameFromStorage);
    }
  }, []);

  const fetchData = async () => {
    try {
      // const companyName = getCompanyName(); // Get the user's company name
      // const isSuperAdmin = getUserRole(); // Function to check if the user is superadmin
      const { result } = await GetCarModel(); // Fetch car models
      const selectedCompanyName =  (() => {
                const name1 = getCompanyName();
                if (name1) return name1;
              
                const name2 = getUserName();
                if (name2) return name2;
              
                const name3 = getsuperadmincompanyname();
                return name3;
              })();
      
      const filtered = selectedCompanyName === 'superadmin' ? 
      result 
      : result?.filter((item) =>{
        console.log(item.adminCompanyName, selectedCompanyName, item.adminCompanyName === selectedCompanyName )
        item?.adminCompanyName.toLowerCase() === selectedCompanyName.toLowerCase()
      }
        ); // Regular user sees only their company's data

      // Update state with the filtered data
      setData(result);
      setFilteredData(filtered);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error by setting empty data
      setData([]);
      setFilteredData([]);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL_CarModel}/${id}`);
      const { data } = response;
      if (data.status === 200) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
        toast.success(data.message || "CarModel deleted successfully.");
      } else {
        toast.warn(data.message || "Failed to delete the Badge.");
      }
    } catch (error) {
      console.error("Error deleting Badge:", error);
      toast.error(
        error.response?.data?.message ||
        "An error occurred while deleting the Badge. Please try again."
      );
    }
  };

  useEffect(() => {
      const selectedCompanyName = (() => {
        const name1 = getCompanyName();
        if (name1) return name1;
      
        const name2 = getUserName();
        if (name2) return name2;
      
        const name3 = getsuperadmincompanyname();
        return name3;
      })();
      const filtered = data?.filter((item) => {
      const companyMatch = selectedCompanyName === 'superadmin' ? data : item?.adminCompanyName.toLowerCase() === selectedCompanyName.toLowerCase();
      const usernameMatch =
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return companyMatch && usernameMatch;
    });
    setFilteredData(filtered);

    const filteredd = models.filter((item) =>
      String(item).toLowerCase().includes(filtersearch.toLowerCase()) 
    );
    setSelectedModell(filteredd);
  }, [searchTerm,filtersearch, data, selectedCompanyName]);



  const OpenBadgeModle = () => {
    setIsOpenBadge(!isOpenBadge);
  };

  const handleEdit = (id) => {
    setSelectedUserId(id);
    setIsOpenVehicleUpdate(true);
  };

  const OpenVehicleUpdateModle = () => {
    setIsOpenVehicleUpdate(!isOpenVehicleUpdate);
  };

  useEffect(()=>{
    const dataToPaginate = dataToBeFetchedManufacturer.length > 0 ? dataToBeFetchedManufacturer : filteredData;
    const totalPage = Math.ceil(dataToPaginate.length / itemperpage);
    setTotalPages(totalPage);
  }, [itemperpage, selectedModel, filteredData, dataToBeFetchedManufacturer])
  
  useEffect(()=>{
    const startIndex = (currentPage - 1) * itemperpage;
    const endIndex=currentPage*itemperpage;
    const currentRecords = filteredData.slice(startIndex,endIndex) ;
    setDataToBeFetched(currentRecords);
  },[data,filteredData,itemperpage,currentPage]);
  

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-[100vh] overflow-hidden">
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className=" w-[80%] xl:w-[85%] min-h-screen">
          <div  className="justify-between mx-auto items-center  w-full overflow-y-auto pr-4 "
          style={{
      height:"calc(100vh - 90px)"}}
          >

            <h1 className="text-[#313342] font-medium text-2xl py-5 pb-8  flex gap-2 items-center">
             <div className="myborder flex gap-3 border-2 border-t-0 border-l-0 border-r-0">
             <span className="opacity-65" >Vehicle Setting</span> 
             <div className="flex items-center gap-3 myborder2">
             <span><img src="/setting_arrow.svg" className="w-2 h-4 object-cover object-center  "></img></span>
             <span>Models</span>
             </div>
             </div>
            </h1>
            <div className="w-full py-5">
            <div className="drop-shadow-custom4 ">
      {/* top section  */}

            {/* <div className="flex justify-between">
              <div className="flex gap-2">
                <div className="text-custom-bg mt-2">Show</div>
                <div>
                  <select
                    value={itemperpage}
                    onChange={(e) => setitemperpage(e.target.value)}
                    className="border rounded-md pl-2 py-2 w-16 border-custom-bg"
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
                </div>{" "}
                <div className="text-custom-bg mt-2">entries</div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-4 py-2 w-64"
                />
              </div>
              <button
                onClick={OpenBadgeModle}
                className="bg-custom-bg text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <img src="/plus.png" alt="Add Company" className="w-4 h-4" />
                Add Model
              </button>
            </div> */}

          <div className="flex justify-between w-full py-2 px-2">
              <div className="flex flex-wrap justify-between flex-col sm:flex-row sm:items-center gap-3 w-full">
                <div className="flex justify-between gap-7 items-center">
                  <div className="md:flex gap-3 hidden items-center">
                    <div className="font-sans font-medium text-sm">Show</div>
                    <div>
                      <select
                        value={itemperpage}
                        onChange={(e) => {
                          setitemperpage(e.target.value);
                          setCurrentPage(1);
                          // console.log("value",e.target.value)
                        }}
                        className="rounded-lg w-12 px-1 h-8 bg-[#E0E0E0] focus:outline-none"
                      >
                        <option disabled>0</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="font-sans font-medium text-sm">Entries</div>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      <img src="/search.svg" className="absolute left-3 top-2" alt="Search Icon" />
                      <input
                        type="text"
                        placeholder="Search by Model"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-lg pl-10 sm:px-10 py-1 border-[#9E9E9E] text-[#9E9E9E] focus:outline-none focus:ring focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={OpenBadgeModle}
                  className="w-[132px] font-sans font-bold text-xs bg-[#313342] text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 px-3 flex py-[10px] gap-2"
                >
                  <img src="/plus.svg" alt="Add Company" className="" />
                  Add Model
                </button>
              </div>
          </div>


      {/* top section ends here */}

            {/* <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>


                    <th className="px-4 py-2 bg-custom-bg text-white text-sm" onClick={() => setShowFilter(!showFilter)}>
                      Make
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Model
                    </th>

                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Car Active
                    </th>
                    <th className="px-4 py-2 bg-custom-bg text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {currentRecords.map((item) => (
                    <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.makemodel}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <img src="/edit.png" alt="delete" className="w-6" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <img src="/trash.png" alt="delete" className="w-6" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}

                    {/* <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 mt-4">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 bg-custom-bg text-white text-sm">Model</th>
                              <th
                                   className="px-4 py-2 bg-custom-bg text-white text-sm cursor-pointer"
                                  onClick={() => setShowFilter(!showFilter)}  >
                                  {showFilter ? (
                                      <img src="/ufilter.png" alt="up filter" className="w-6 inline mr-2" />
                                    ) : (
                                      <img src="/dfilter.png" alt="down filter" className="w-6 inline mr-2" />
                                    )}
                                    Manufacturer
                              </th>
                                <th className="px-4 py-2 bg-custom-bg text-white text-sm">Car Active</th>
                                <th className="px-4 py-2 bg-custom-bg text-white text-sm">Actions</th>
                              </tr>
                              
                          {showFilter && (
                            <div className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                              <ul>
                                <li>
                                <input
                                      type="text"
                                      placeholder="Search"
                                      value={filtersearch}
                                      onChange={(e) => setSearchfilter(e.target.value)}
                                      className="border rounded px-4 py-2 w-48"
                                    />
                                </li>
                                <li
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleFilterChange('')}
                                >
                                  All Models
                                </li>
                                {selectedModell.map((model, index) => (
                                  <li
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleFilterChange(model || '')}
                                  >
                                    {model}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                              {currentRecords.map((item) => (
                                <tr key={item._id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.makemodel}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.isActive ? 'Active' : 'Inactive'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={() => handleEdit(item._id)}
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      <img src="/edit.png" alt="edit" className="w-6" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(item._id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <img src="/trash.png" alt="delete" className="w-6" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div> */}

                <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                      <table className="w-full bg-white border table-fixed">
                        <thead className="font-sans font-bold text-sm text-left">
                          <tr className="text-white bg-[#38384A]">
                            <th className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg">Model</th>
                            <th
                              className="px-4 py-3 w-[165px] relative text-center text-white bg-custom-bg cursor-pointer"
                              
                            >
                              Manufacturer
                              {showFilter ? (
                                <img src="/ufilter.png" alt="up filter" className="w-6 inline mr-2"
                                onClick={() => setShowFilter(!showFilter)}
                                />
                              ) : (
                                <img src="/dfilter.png" alt="down filter" className="w-6 inline mr-2"
                                onClick={() => setShowFilter(!showFilter)}
                                />
                              )}

                            {showFilter && (

                            <div className="absolute rounded-4 font-sans text-[10px] z-[9999] custom-scrollbary drop-shadow-custom4 w-[110px] h-[120px] overflow-y-auto overflow-x-hidden right-0 ">
                              <ul className="font-sans font-semibold ">
                                <li>
                                <input
                                      type="text"
                                      placeholder="Search"
                                      value={filtersearch}
                                      onChange={(e) => {
                                        setSearchfilter(e.target.value)
                                      }}
                                      className="border rounded px-4 py-1 w-full  text-[#9E9E9E] focus:outline-none "
                                    />
                                </li>
                                <li
                                  className=" text-start px-4 py-1 cursor-pointer hover:bg-[#313342C9] hover:text-white"
                                  onClick={() => handleFilterChange('')}
                                >
                                  All Models
                                </li>
                                {selectedModell.map((model, index) => (
                                  <li
                                    key={index}
                                    className=" text-start px-4 py-1 cursor-pointer hover: hover:bg-[#313342C9]  hover:text-white"
                                    onClick={() =>{
                                      handleFilterChange(model)
                                      setCurrentPage(1);
                                    }
                                      
                                    } 
                                  >
                                    {model}
                                  </li>
                                ))}
                              </ul>
                            </div>

                          )}
        

            </th>
            <th className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg">Status</th>
            <th className="px-4 py-3 min-w-[150px] w-[150px] text-center text-white bg-custom-bg">Action</th>
          </tr>
        </thead>
        <tbody className="font-sans font-medium text-sm">                  
          { dataToBeFetchedManufacturer.length?(dataToBeFetchedManufacturer.map((item) => (
            <tr key={item._id} className="border-b text-center">
              <td className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                {item.name}
              </td>
              <td className="py-3 px-4 w-[165px] ">
                {item.makemodel}
              </td>
              <td className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                <span
                  className={` ${
                    item.isActive ||item.isActive===false ? "bg-[#38384A33] px-4 py-2 rounded-[22px] text-xs" : ""
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                <div className="flex gap-4 justify-center">
                  <button onClick={() => handleEdit(item._id)}>
                    <img src="/edit.png" alt="edit" className="w-6" />
                  </button>
                  <button onClick={() => handleDelete(item._id)}>
                    <img src="/trash.png" alt="delete" className="w-6" />
                  </button>
                </div>
              </td>
            </tr>
          ))):
          (
            dataToBeFetched.map((item) => (
              <tr key={item._id} className="border-b text-center">
                <td className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                  {item.name}
                </td>
                <td className="py-3 px-4 w-[165px] ">
                  {item.makemodel}
                </td>
                <td className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                  <span
                    className={` ${
                      item.isActive ||item.isActive===false ? "bg-[#38384A33] px-4 py-2 rounded-[22px] text-xs" : ""
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 min-w-[150px] w-[150px] whitespace-normal break-all overflow-hidden">
                  <div className="flex gap-4 justify-center">
                    <button onClick={() => handleEdit(item._id)}>
                      <img src="/edit.png" alt="edit" className="w-6" />
                    </button>
                    <button onClick={() => isopendeletemodel(item._id)}>
                      <img src="/trash.png" alt="delete" className="w-6" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )
          
          }
          
        </tbody>
      </table>
    </div>

      {/* table ends here */}
 
      {/* pagination */}
            {/* <div className="flex justify-center text-center mt-4 gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span
                className={`px-3 py-1 mx-1 rounded ${currentPage
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
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
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
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`h-8 px-2 border rounded-lg ${
                            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Pagination Logic */}
                      {totalPages > 0 && (
                        <>
                          {totalPages <= 3 ? (
                            // Show all pages if total pages are 3 or fewer
                            Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                              <li key={page}>
                                <button
                                  onClick={() => setCurrentPage(page)}
                                  className={`h-8 w-8 border rounded-lg ${
                                    currentPage === page ? "bg-custom-bg text-white" : "bg-white"
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
                                    <button className="h-8 w-8 border rounded-lg bg-custom-bg text-white">1</button>
                                  </li>
                                  <li><span className="px-2">...</span></li>
                                  <li>
                                    <button onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 border rounded-lg bg-white">
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
                                  <li><span className="px-2">...</span></li>
                                  <li>
                                    <button onClick={() => setCurrentPage(totalPages)} className="h-8 w-8 border rounded-lg bg-white">
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
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`h-8 px-2 border rounded-lg ${
                            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>


            {/* pagination ends here  */}

            </div>
            </div>
            
          </div>
        </div>
      </div>
      <AddCarModel
        isOpen={isOpenBadge}
        onClose={OpenBadgeModle}
        fetchData={fetchData}
      />
      <UpdateCarModel
        isOpen={isOpenVehicleUpdate}
        onClose={OpenVehicleUpdateModle}
        fetchData={fetchData}
        updateid={selectedUserId}
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