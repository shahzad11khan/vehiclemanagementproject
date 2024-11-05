"use client";
import { API_URL_Vehicle_getspecificvehicleid } from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useState, useEffect } from "react";
// import { toast } from "react-toastify";

const AddMaintenanceModal = ({ isOpen, onClose, fetchData, selectedid }) => {
  console.log("Add maintainence id ", selectedid, typeof selectedid);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    issues: "",
    VehicleName: "",
    registrationNumber: "", // Add registration number to formData
    repairHistory: [
      {
        images: [],
        organisation: "",
        repairStatus: "",
        jobNumber: "",
        memo: "",
        parts: [{ partNumber: "", partName: "", price: 0, supplier: "" }],
        labourHours: 0,
        cost: 0,
        signedOffBy: "",
        date: "",
      },
    ],
    adminCreatedBy: "",
    adminCompanyName: "",
    adminCompanyId: "",
  });

  const fetchDat = async () => {
    if (selectedid) {
      console.log(selectedid);
      setLoading(true); // Indicate loading started
      try {
        const response = await axios.get(
          `${API_URL_Vehicle_getspecificvehicleid}/${selectedid}`
        );
        console.log("get data: ", response.data);
        const data = response.data.result;

        if (data) {
          // Assuming you want to store vehicle model and registration number
          setFormData((prevData) => ({
            ...prevData,
            VehicleName: data.model, // Assuming 'model' is the key for the vehicle model
            registrationNumber: data.registrationNumber, // Assuming 'registrationNumber' is the key for registration number
          }));
        } else {
          // Handle the case when there is no data
          console.warn("No data found for the selected vehicle ID.");
        }
      } catch (err) {
        console.error("Error fetching data:", err); // Log the error
      } finally {
        setLoading(false); // Indicate loading ended
      }
    } else {
      console.log("No selected ID found");
    }
  };

  useEffect(() => {
    const companyName = localStorage.getItem("companyName");
    if (companyName) {
      setFormData((prevData) => ({
        ...prevData,
        adminCompanyName: companyName,
      }));
    }
    fetchDat(); // Fetch data whenever the component mounts or selectedid changes
  }, [selectedid]); // Include selectedid in the dependency array

  const handleAddPart = (index) => {
    const updatedRepairHistory = [...formData.repairHistory];
    updatedRepairHistory[index].parts.push({
      partNumber: "",
      partName: "",
      price: 0,
      supplier: "",
    });
    setFormData((prevData) => ({
      ...prevData,
      repairHistory: updatedRepairHistory,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRepairHistoryChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRepairHistory = [...formData.repairHistory];
    updatedRepairHistory[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      repairHistory: updatedRepairHistory,
    }));
  };

  const handlePartChange = (index, partIndex, e) => {
    const { name, value } = e.target;
    const updatedRepairHistory = [...formData.repairHistory];
    updatedRepairHistory[index].parts[partIndex][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      repairHistory: updatedRepairHistory,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    fetchData();
    // try {
    //   const response = await axios.post(API_URL_Title, formData);
    //   setFormData({
    //     issues: "",
    //     repairHistory: [
    //       {
    //         images: [],
    //         organisation: "",
    //         repairStatus: "",
    //         jobNumber: "",
    //         memo: "",
    //         parts: [{ partNumber: "", partName: "", price: 0, supplier: "" }],
    //         labourHours: 0,
    //         cost: 0,
    //         signedOffBy: "",
    //         date: "",
    //         adminCreatedBy: "",
    //         adminCompanyName: "",
    //         adminCompanyId: "",
    //       },
    //     ],
    //     adminCreatedBy: "",
    //     adminCompanyName: formData.adminCompanyName,
    //   });
    //   response.data.success
    //     ? (toast.success(response.data.message), fetchData(), onClose())
    //     : toast.warn(response.data.error);
    // } catch (err) {
    //   console.error(err.response?.data?.message || "Failed to add Title");
    // } finally {
    //   setLoading(false);
    // }
  };

  // New function to handle image uploads
  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedRepairHistory = [...formData.repairHistory];
    updatedRepairHistory[index].images = files; // Store files directly in repairHistory
    setFormData((prevData) => ({
      ...prevData,
      repairHistory: updatedRepairHistory,
    }));
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className=" p-6 rounded-lg shadow-lg w-full bg-white max-w-3xl max-h-[600px] overflow-y-auto">
        <h2 className="text-3xl font-semibold text-center mb-2">
          Add Maintenance
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">
                Vehicle Name
              </label>
              <input
                type="text"
                value={formData.VehicleName}
                name="VehicleName"
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                readOnly
              />
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">
                Vehicle Registration Number
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                name="VehicleRegistrationNumber"
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Issues/Damage
            </label>
            <textarea
              value={formData.issues}
              name="issues"
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {formData.repairHistory.map((history, index) => (
            <div key={index} className="border border-gray-300 rounded-md p-4">
              <h3 className="text-lg font-semibold">Repair History</h3>

              <div className="flex flex-wrap gap-2">
                {/* Organisation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Organisation
                  </label>
                  <input
                    type="text"
                    name="organisation"
                    value={history.organisation}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                {/* Repair Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Repair Status
                  </label>
                  <input
                    type="text"
                    name="repairStatus"
                    value={history.repairStatus}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                {/* Job Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Number
                  </label>
                  <input
                    type="text"
                    name="jobNumber"
                    value={history.jobNumber}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Memo
                </label>
                <textarea
                  value={history.memo}
                  name="memo"
                  onChange={(e) => handleRepairHistoryChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Parts Section */}
              <h4 className="text-md font-semibold">Parts</h4>
              {history.parts.map((part, partIndex) => (
                <div key={partIndex} className="flex space-x-2">
                  <input
                    type="text"
                    name="partNumber"
                    placeholder="Part Number"
                    value={part.partNumber}
                    onChange={(e) => handlePartChange(index, partIndex, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="text"
                    placeholder="Part Name"
                    name="partName"
                    value={part.partName}
                    onChange={(e) => handlePartChange(index, partIndex, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    name="price"
                    value={part.price}
                    onChange={(e) => handlePartChange(index, partIndex, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="text"
                    placeholder="Supplier"
                    name="supplier"
                    value={part.supplier}
                    onChange={(e) => handlePartChange(index, partIndex, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddPart(index)}
                className="mt-2 bg-blue-500 text-white rounded-md px-4 py-2"
              >
                Add Part
              </button>

              <div className="flex space-x-4">
                {/* Labour Hours */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Labour Hours
                  </label>
                  <input
                    type="number"
                    value={history.labourHours}
                    onChange={(e) => {
                      const updatedHistory = [...formData.repairHistory];
                      updatedHistory[index].labourHours = Number(
                        e.target.value
                      );
                      setFormData((prevData) => ({
                        ...prevData,
                        repairHistory: updatedHistory,
                      }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                {/* Cost */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Cost
                  </label>
                  <input
                    type="number"
                    value={history.cost}
                    onChange={(e) => {
                      const updatedHistory = [...formData.repairHistory];
                      updatedHistory[index].cost = Number(e.target.value);
                      setFormData((prevData) => ({
                        ...prevData,
                        repairHistory: updatedHistory,
                      }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                {/* Signed Off By */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Signed Off By
                  </label>
                  <input
                    type="text"
                    value={history.signedOffBy}
                    onChange={(e) => {
                      const updatedHistory = [...formData.repairHistory];
                      updatedHistory[index].signedOffBy = e.target.value;
                      setFormData((prevData) => ({
                        ...prevData,
                        repairHistory: updatedHistory,
                      }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={history.date}
                  onChange={(e) => {
                    const updatedHistory = [...formData.repairHistory];
                    updatedHistory[index].date = e.target.value;
                    setFormData((prevData) => ({
                      ...prevData,
                      repairHistory: updatedHistory,
                    }));
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  accept="image/*"
                />
                <div className="mt-2">
                  {history.images.length > 0 && (
                    <ul className="list-disc ml-5">
                      {Array.from(history.images).map((file, fileIndex) => (
                        <li key={fileIndex} className="text-sm text-gray-600">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white rounded-md p-2 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={onClose}
            className={`w-full bg-blue-600 text-white rounded-md p-2 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
