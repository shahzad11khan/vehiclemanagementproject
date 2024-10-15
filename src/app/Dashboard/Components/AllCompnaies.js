"use client";
import React, { useEffect, useState } from "react";
import { GetCompany } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import Card from "./Card";

const AllCompnaies = () => {
  const [data, setData] = useState([]); // State to hold fetched data

  const fetchData = async () => {
    try {
      GetCompany().then(({ result }) => {
        setData(result); // Set the fetched data
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Reset data to an empty array on error
    }
  };
  //
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container mx-auto px-4 py-2">
      <h1 className="text-2xl font-bold text-center mb-8">Companies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {data.map((company) => (
          <Card
            key={company._id}
            image={company.image}
            company={company.CompanyName}
            companyId={company._id}
          />
        ))}
      </div>
    </div>
  );
};

export default AllCompnaies;
