import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col justify-center items-center relative bg-custom-bg">
      <div
        className="absolute bottom-0 -left-40 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-[400px] opacity-70 transform translate-y-1/4 rounded-full"
        style={{ backgroundColor: "#23397D" }}
      ></div>
      <div
        className="absolute bottom-0 -left-40 w-[272px] h-[272px] md:w-[372px] md:h-[372px] lg:w-[372px] lg:h-[372px]  opacity-70 transform translate-y-1/4 rounded-full"
        style={{
          backgroundColor: "#244BC5",
        }}
      ></div>
      <div
        className="absolute bottom-0 -left-40 w-[288px] h-[288px] md:w-[338px] md:h-[338px] lg:w-[438px] lg:h-[438px] opacity-70 transform translate-y-1/4 rounded-full"
        style={{
          backgroundColor: "#23397D",
        }}
      ></div>
      {/* Background Image */}
      <div className="w-6/12 border-white  flex justify-center gap-4 bg-transparent">
        <div className="w-[150px] h-[150px] bg-transparent flex flex-col items-center gap-3">
          <img src="/01.png" alt="Management Icon" className="w-full h-auto" />
          <Link href="/Dashboard/StartPage" className="w-full rounded-lg">
            <button className="px-4 py-2 w-full ">Management</button>
          </Link>
        </div>
        <div className="w-[150px] h-[150px] bg-transparent flex flex-col items-center gap-2">
          <img src="/02.png" alt="Management Icon" className="w-full h-auto" />
          <Link href="/Dashboard/StartPage" className="w-full rounded-lg">
            <button className="px-4 py-2 w-full">Management</button>
          </Link>
        </div>
        <div className="w-[150px] h-[150px] bg-transparent flex flex-col items-center gap-2">
          <img
            src="/03.png"
            alt="Management Icon"
            className="w-full h-auto rounded-lg"
          />
          <Link href="/Dashboard/StartPage" className="w-full rounded-lg">
            <button className="px-4 py-2 w-full">Management</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
