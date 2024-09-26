// components/VehicleModal.js
import React from "react";

const FavouriteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">Favourites</h2>

        {/* Grid layout */}
        <div className="grid grid-cols-4 gap-10">
          {/* Manufacturer Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">System Reports</h3>
            <ul className="space-y-2 w-60">
              <li>
                <a href="#" className="px-4 py-2  rounded hover:bg-gray-200">
                  Employee Update Reports
                </a>
              </li>
              <li>
                <a href="#" className=" px-4 py-2  rounded hover:bg-gray-200">
                  Rental Invoice Reports
                </a>
              </li>
              <li>
                <a href="#" className=" px-4 py-2  rounded hover:bg-gray-200">
                  Overdue Payment Reports
                </a>
              </li>
            </ul>
          </div>

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

export default FavouriteModal;
