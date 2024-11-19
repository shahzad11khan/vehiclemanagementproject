import React from "react";

const LoadingScreen = ({ loading }) => {
  return (
    <div
      className="min-h-screen overflow-hidden flex flex-col justify-center items-center relative"
      style={{
        backgroundImage: "url('/bgimage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Image */}
      <div className="w-[50px] bg-transparent border-white border-[10px] h-[50px] md:w-[100px] md:h-[100px] lg:w-[200px] lg:h-[200px]  rounded-full flex items-center justify-center">
        <div className="w-[100px] border-gray-500 bg-transparent border-[15px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[170px] lg:h-[170px] rounded-full flex items-center justify-center">
          <div
            className="w-[50px] border-gray-500 h-[50px] md:w-[100px] md:h-[100px] lg:w-[130px] lg:h-[130px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#456DF4" }}
          >
            <img
              src="/loadingtayer.png"
              alt="tayer"
              className={`w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-transparent ${
                loading ? "animate-spin" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Centered Text */}
      {/* <div className="w-full flex justify-center items-center py-4 "> */}
      <div className="text-2xl  text-white bg-transparent w-[300px] h-[100px]   text-[24px] text-center font-medium ">
        Optimizing Every Mile Managing Every Move..
      </div>
      {/* </div> */}
    </div>
  );
};

export default LoadingScreen;
