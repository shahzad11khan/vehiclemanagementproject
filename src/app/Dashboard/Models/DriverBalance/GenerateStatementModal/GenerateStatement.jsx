"use client";
import { useState } from "react";

const GenerateStatement = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    exportAs: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generating report with data:", formData);
    // Backend integration will be added later
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-12 w-[528px] rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Generate Statement</h2>
          <img
            src="/crossIcon.svg"
            className="cursor-pointer"
            alt="Close"
            onClick={onClose}
          />
        </div>

        <h2 className="text-xs font-medium">
          Statement Duration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fromDate" className="text-[10px]">
                From
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-[#42506666] shadow rounded  focus:ring-blue-500 focus:border-blue-500 "
                required
              />
            </div>

            <div>
              <label htmlFor="toDate" className="text-[10px]">
                To
              </label>
              <input
                type="date"
                id="toDate"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300   focus:ring-blue-500  border-[#42506666] shadow rounded shadowfocus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="exportAs" className="text-[10px]">
                Export As
              </label>
              <select
                id="exportAs"
                name="exportAs"
                value={formData.exportAs}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border   focus:ring-blue-500 focus:border-blue-500 border-[#42506666]  rounded shadow"
                required
              >
                <option value="">Select format</option>
                <option value="pdf">PDF</option>
                <option value="txt">Text (.txt)</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>


          <div className="flex gap-[10px] justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateStatement;