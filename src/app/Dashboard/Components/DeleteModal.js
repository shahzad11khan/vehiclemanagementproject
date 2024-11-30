const DeleteModal = ({ isOpen, onClose, onDelete, Id }) => {
  if (!isOpen) return null;

  // Pass the Id to handleDelete when Confirm Delete is clicked
  const handleConfirmDelete = () => {
    onDelete(Id); // Pass the Id from DeleteModal to handleDelete function
    onClose(); // Close the modal after deletion
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex flex-col items-center">
          {/* Modal Title */}
          <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
          {/* Modal Description */}
          <p className="text-sm text-gray-600 mb-6">
            Are you absolutely sure you want to permanently delete this item?
            Once deleted, this action cannot be undone. All associated data and
            files will be lost, and you will not be able to recover it.
          </p>
          {/* Modal Buttons */}
          <div className="flex justify-between w-full">
            <button
              onClick={onClose}
              className="px-6 py-2 ml-2 text-custom-bg rounded-lg border-2 border-custom-bg hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-6 py-2 bg-custom-bg text-white rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
