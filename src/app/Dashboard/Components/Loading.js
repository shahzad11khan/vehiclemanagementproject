// components/Loading.js
import React from "react";

const Loading = () => {
  return (
    
    <div className="flex justify-center items-center h-screen gap-3">
      <div className="w-12 h-12 border-4 border-t-4 border-red-500 border-solid rounded-full animate-spin-slow bg-transparent">
        <style jsx>{`
          .animate-spin-slow {
            animation: spin 1s linear infinite, colorChange 1s infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes colorChange {
            0% {
              border-top-color: #ff0000; /* Red */
            }
            25% {
              border-top-color: #00ff00; /* Green */
            }
            50% {
              border-top-color: #0000ff; /* Blue */
            }
            75% {
              border-top-color: #ff00ff; /* Magenta */
            }
            100% {
              border-top-color: #ff0000; /* Red */
            }
          }
        `}</style>

      </div>
        <h1 className="font-bold">Loding<span className="text-red-700">.</span><span className="text-red-600">.</span><span className="text-red-500">.</span></h1>
    </div>
     
  );
};

export default Loading;
