"use client";

import React, { useEffect, useState } from "react";
import Card from "../../Components/Card";
import { isAuthenticated } from "@/utils/verifytoken";
import { GetCompany } from "../../Components/ApiUrl/ShowApiDatas/ShowApiDatas";
import { useRouter } from "next/navigation";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    // Fetch company data
    const fetchData = async () => {
      try {
        const { result } = await GetCompany();
        setData(result);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="h-[100vh] overflow-hidden">
      <Header className="min-w-full" />
      <div className="flex gap-4">
        <Sidebar />
        <div className=" w-[80%] xl:w-[85%] min-h-screen py-10  pr-2 overflow-auto"
         style={{
          height:"calc(100vh - 90px)"}}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 pb-10 lg:grid-cols-5 gap-4 px-2 ">
            {data.length > 0 ? (
              data.map((company) => (
                <Card
                  key={company._id}
                  image={company.image}
                  company={company.CompanyName}
                  companyId={company._id}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No companies found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
