import React from "react";

const LoadingScreen = ({ loading, }) => {
  return (
    <div
      className="min-h-screen overflow-hidden flex flex-col justify-center gap-10 items-center relative"
      style={{
        backgroundImage: "url('/bgImage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="h-[100%] w-full absolute top-0 bg-[#27273A] opacity-[78%] "></div>

      {/* Background Image */}
      <div className="w-[150px] bg-transparent border-white border-[8px] h-[150px] md:w-[170px] md:h-[170px] lg:w-[200px] lg:h-[200px]  rounded-full flex items-center justify-center relative z-10">
        <div className="w-[125px] h-[125px] border-[#FFFFFF7D] border-[13px]  bg-transparent  md:w-[145px] md:h-[145px] lg:w-[170px] lg:h-[170px] rounded-full flex items-center justify-center">
          <div
            className="w-[90px] border-gray-500 h-[90px] md:w-[110px] md:h-[110px] lg:w-[130px] lg:h-[130px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#456DF4" }}
          >
            <img
              src="/loadingtayer.png"
              alt="tayer"
              className={`w-16 h-16 md:w-[5rem] md:h-[5rem] lg:w-24 lg:h-24 bg-transparent ${
                loading ? "animate-spin" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Centered Text */}
      {/* <div className="w-full flex justify-center items-center py-4 "> */}
      <div className="  text-white bg-transparent w-[50%] h-[100px]  font-sans text-xl sm:text-2xl line lg:text-5xl md:text-3xl text-center font-medium relative z-10 ">
        Optimizing Every Mile Managing Every Move..
      </div>
      {/* </div> */}
    </div>
  );
};

export default LoadingScreen;
