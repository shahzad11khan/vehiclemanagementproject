import { useEffect } from "react";

const DeleteModal = ({ isOpen, onClose, onDelete, Id }) => {

  useEffect(() => {
          if (isOpen) {
            document.body.style.overflow = "hidden"; // Disable scrolling
          } else {
            document.body.style.overflow = ""; // Restore scrolling
          }
      
          return () => (document.body.style.overflow = ""); // Cleanup on unmount
        }, [isOpen]);

  if (!isOpen) return null;

  // Pass the Id to handleDelete when Confirm Delete is clicked
  const handleConfirmDelete = () => {
    onDelete(Id); // Pass the Id from DeleteModal to handleDelete function
    onClose(); // Close the modal after deletion
  };

  return (
    <div className=" h-screen fixed inset-0 bg-modal-bg bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-72 sm:w-96">
        <div className="flex flex-col items-center">
          {/* Modal Title */}
          <div className="flex justify-between w-full ">
          <h2 className="text-lg font-semibold mb-2">Delete</h2>
          <div className='hover:cursor-pointer' onClick={onClose}>
            <img src="/x-close.svg" alt="close" />
          </div>
          </div>
          {/* Modal Description */}
          <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete? This action cannot be undone.
          </p>
          {/* Modal Buttons */}
          <div className="flex gap-5 flex-col justify-between w-full">
            <button
              onClick={handleConfirmDelete}
              className="px-6 py-3 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Delete
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
    </div>
  );
};

export default DeleteModal;
