"use client";
import React, { useEffect, useState } from "react";
import { GetCompany } from "../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import Card from "./Card";

const AllCompanies = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { result } = await GetCompany();
        setData(result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-2">
      <h1 className="text-2xl font-bold text-center mb-8 underline">
        All Companies
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
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

export default AllCompanies;
