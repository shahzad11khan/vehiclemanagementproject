"use client";
import React, { useEffect } from "react";
import Link from "next/link";

const VehicleModal = ({ isOpen, onClose, onMouseEnter, onMouseLeave }) => {
  useEffect(() => {
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
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 modal-background"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <h2 className="text-2xl font-semibold mb-6">Vehicle Management</h2>

        {/* Grid layout */}
        <div className="grid grid-cols-4 gap-2">
          {/* Manufacturer Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Manufacturer</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Manufacturer/GetManufacturers"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Manufacturers
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Type Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Vehicle Type</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/VehicleType/GetVehicleTypes"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Vehicle Types
                </Link>
              </li>
            </ul>
          </div>

          {/* Enquiry Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Enquiry</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Enquiry/GetEnquiries"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Firm Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Firm</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Firm/GetFirms"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Firms
                </Link>
              </li>
            </ul>
          </div>

          {/* Signature Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Signature</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Signature/GetSignatures"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Signatures
                </Link>
              </li>
            </ul>
          </div>

          {/* Local Authority Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Local Authority</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/LocalAuthority/GetLocalAuthority"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Local Authority
                </Link>
              </li>
            </ul>
          </div>

          {/* Supplier Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Supplier</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Supplier/GetSuppliers"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Suppliers
                </Link>
              </li>
            </ul>
          </div>

          {/* Employee Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Employee</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Employee/GetEmployees"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Employees
                </Link>
              </li>
            </ul>
          </div>

          {/* Badge Type Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Badge Type</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Badge/GetBadges"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Badges
                </Link>
              </li>
            </ul>
          </div>

          {/* Insurance Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Insurance</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Insurance/GetInsurances"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Insurances
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Cycle Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Cycle</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Dashboard/Models/Payment/GetPayments"
                  className="px-4 py-2 rounded hover:bg-gray-200"
                >
                  All Payments
                </Link>
              </li>
            </ul>
          </div>
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

export default VehicleModal;
