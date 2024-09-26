// import React, { useEffect } from "react";

// const ReportsModal = ({ isOpen, onClose, onMouseEnter, onMouseLeave }) => {
//   useEffect(() => {
//     // Ensure modal closes when clicked outside if necessary
//     const handleClickOutside = (event) => {
//       if (event.target.classList.contains("modal-background")) {
//         onClose();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose]);
//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-20 modal-background"
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//     >
//       <div
//         className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl"
//         onMouseEnter={onMouseEnter}
//         onMouseLeave={onMouseLeave}
//       >
//         <h2 className="text-2xl font-semibold mb-6">Reports</h2>

//         {/* Grid layout */}
//         <div className="grid grid-cols-4 gap-2 max-h-screen">
//           {/* Manufacturer Section */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">System Reports</h3>
//             <ul className="space-y-2 w-60">
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Employee Update Reports
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Rental Invoice Reports
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Overdue Payment Reports
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Vehicle Reports Section */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Vehicle Reports</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Interim Test Expiry
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Mot Expiry
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Road Tax Expiry
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Test Date Expiry
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Plate Expiry
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Driver Reports Section */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3">Driver Reports</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="#" className="px-4 py-1 rounded hover:bg-gray-200">
//                   Drivers Holidays
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Licence Expiry
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
//                   Taxi Badge Expiry
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Local Authority Section */}
//           {/* Add other sections similarly */}
//         </div>

//         <button
//           onClick={onClose}
//           className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ReportsModal;
"use client";
import React, { useEffect } from "react";

const ReportsModal = ({ isOpen, onClose, onMouseEnter, onMouseLeave }) => {
  useEffect(() => {
    // Ensure modal closes when clicked outside if necessary
    const handleClickOutside = (event) => {
      if (event.target.classList.contains("modal-background")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-20 modal-background"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <h2 className="text-2xl font-semibold mb-6">Reports</h2>

        {/* Grid layout */}
        <div className="grid grid-cols-4 gap-2 max-h-screen">
          {/* Manufacturer Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">System Reports</h3>
            <ul className="space-y-2 w-60">
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Employee Update Reports
                </a>
              </li>
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Rental Invoice Reports
                </a>
              </li>
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Overdue Payment Reports
                </a>
              </li>
            </ul>
          </div>

          {/* Vehicle Reports Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Vehicle Reports</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Interim Test Expiry
                </a>
              </li>
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Mot Expiry
                </a>
              </li>
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Road Tax Expiry
                </a>
              </li>
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Test Date Expiry
                </a>
              </li>
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Plate Expiry
                </a>
              </li>
            </ul>
          </div>

          {/* Driver Reports Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Driver Reports</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="px-4 py-1 rounded hover:bg-gray-200">
                  Drivers Holidays
                </a>
              </li>
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Licence Expiry
                </a>
              </li>
              <li>
                <a href="#" className="px-4 py-2 rounded hover:bg-gray-200">
                  Taxi Badge Expiry
                </a>
              </li>
            </ul>
          </div>

          {/* Local Authority Section */}
          {/* Add other sections similarly */}
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportsModal;
