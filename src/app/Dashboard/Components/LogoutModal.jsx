import React from 'react';
import { useEffect } from 'react';

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
          document.body.style.overflow = ""; // Restore scrolling
        }
    
        return () => (document.body.style.overflow = ""); // Cleanup on unmount
      }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className=" h-screen fixed inset-0 bg-modal-bg bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-72 sm:w-96">

          <div className='flex justify-between'>
            <div>
          <h2 className="text-lg font-semibold mb-2">Logout</h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to Logout ?
          </p>
          </div>
          <div className='hover:cursor-pointer' onClick={onClose}>
            <img src="/x-close.svg" alt="close" />
          </div>
          </div>

          <div className="flex gap-5 flex-col justify-between w-full">
          <button
              onClick={onLogout}
              className="px-6 py-3 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Logout
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3  text-custom-bg rounded-lg border-2 border-[#D5D7DA] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
           
          </div>
        </div>
      </div>
  );
};

export default LogoutModal;