const DeleteModal = ({ isOpen, onClose, onDelete, Id }) => {
  if (!isOpen) return null;

  // Pass the Id to handleDelete when Confirm Delete is clicked
  const handleConfirmDelete = () => {
    onDelete(Id); // Pass the Id from DeleteModal to handleDelete function
    onClose(); // Close the modal after deletion
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg px-4 py-5 w-[343px] h-[264px]">
        <div className="flex flex-col items-center ">
          {/* Modal Title */}

          <div className="flex items-center justify-between w-full mb-2">
            <h2 className="text-lg font-semibold">Delete</h2>
            <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
              onClose();

            }} />

          </div>
          {/* Modal Description */}
          <p className="text-sm text-[#535862] mb-6">
            Are you sure you want to delete? This action cannot be undone.
          </p>
          {/* Modal Buttons */}
          <div className="flex justify-between w-full flex-col gap-3">
            <button
              onClick={handleConfirmDelete}
              className="px-6 py-2 bg-custom-bg text-white font-semibold h-11 rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 w-[311px]"
            >
              Delete
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2  text-custom-bg rounded-lg font-semibold border-2 border-[#D5D7DA] hover:bg-custom-bg hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 w-[311px] h-11"
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
