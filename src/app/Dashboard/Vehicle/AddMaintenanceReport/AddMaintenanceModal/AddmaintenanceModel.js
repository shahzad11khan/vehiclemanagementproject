"use client";
import {
  API_URL_Vehicle_getspecificvehicleid,
  API_URL_Maintainance,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AddMaintenanceModal = ({ isOpen, onClose, fetchData, selectedid }) => {
  const [loading, setLoading] = useState(false);
  const [repaitformData, setrepaitformData] = useState({
    issues: "",
    VehicleName: "",
    registrationNumber: "",
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
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL_Vehicle_getspecificvehicleid}/${selectedid}`
        );
        const data = response.data.result;
        if (data) {
          setrepaitformData((prevData) => ({
            ...prevData,
            VehicleName: data.model,
            registrationNumber: data.registrationNumber,
          }));
        } else {
          console.warn("No data found for the selected vehicle ID.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No selected ID found");
    }
  };

  useEffect(() => {
    const companyName = localStorage.getItem("companyName");
    if (companyName) {
      setrepaitformData((prevData) => ({
        ...prevData,
        adminCompanyName: companyName,
      }));
    }
    fetchDat();
  }, [selectedid]);

  const handleAddPart = (index) => {
    const updatedRepairHistory = [...repaitformData.repairHistory];
    updatedRepairHistory[index].parts.push({
      partNumber: "",
      partName: "",
      price: 0,
      supplier: "",
    });
    setrepaitformData((prevData) => ({
      ...prevData,
      repairHistory: updatedRepairHistory,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setrepaitformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRepairHistoryChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRepairHistory = [...repaitformData.repairHistory];
    updatedRepairHistory[index][name] = value;
    setrepaitformData((prevData) => ({
      ...prevData,
      repairHistory: updatedRepairHistory,
    }));
  };

  const handlePartChange = (index, partIndex, e) => {
    const { name, value } = e.target;
    const updatedRepairHistory = [...repaitformData.repairHistory];
    updatedRepairHistory[index].parts[partIndex][name] = value;
    setrepaitformData((prevData) => ({
      ...prevData,
      repairHistory: updatedRepairHistory,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append direct fields
      formData.append("issues", repaitformData.issues);
      formData.append("VehicleName", repaitformData.VehicleName);
      formData.append("registrationNumber", repaitformData.registrationNumber);
      formData.append("adminCompanyName", repaitformData.adminCompanyName);
      formData.append("adminCreatedBy", repaitformData.adminCreatedBy);

      // Append nested repairHistory array
      repaitformData.repairHistory.forEach((history, i) => {
        formData.append(
          `repairHistory[${i}][organisation]`,
          history.organisation
        );
        formData.append(
          `repairHistory[${i}][repairStatus]`,
          history.repairStatus
        );
        formData.append(`repairHistory[${i}][jobNumber]`, history.jobNumber);
        formData.append(`repairHistory[${i}][memo]`, history.memo);
        formData.append(
          `repairHistory[${i}][labourHours]`,
          history.labourHours
        );
        formData.append(`repairHistory[${i}][cost]`, history.cost);
        formData.append(
          `repairHistory[${i}][signedOffBy]`,
          history.signedOffBy
        );
        formData.append(`repairHistory[${i}][date]`, history.date);

        // Append images (if they exist)
        history.images.forEach((image, j) => {
          formData.append(`repairHistory[${i}][images][${j}]`, image);
        });

        // Append parts array within each repairHistory item
        history.parts.forEach((part, j) => {
          formData.append(
            `repairHistory[${i}][parts][${j}][partNumber]`,
            part.partNumber
          );
          formData.append(
            `repairHistory[${i}][parts][${j}][partName]`,
            part.partName
          );
          formData.append(
            `repairHistory[${i}][parts][${j}][price]`,
            part.price
          );
          formData.append(
            `repairHistory[${i}][parts][${j}][supplier]`,
            part.supplier
          );
        });
      });

      const response = await axios.post(API_URL_Maintainance, formData);
      console.log(response);
      response.data.success
        ? toast.success(response.data.message)
        : toast.warn(response.data.error);
      if (response.data.success) {
        fetchData(); // Refresh data on success
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
      toast.error("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedRepairHistory = [...repaitformData.repairHistory];
    updatedRepairHistory[index].images = files;
    setrepaitformData((prevData) => ({
      ...prevData,
      repairHistory: updatedRepairHistory,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="p-6 rounded-lg shadow-lg w-full bg-white max-w-3xl max-h-[600px] overflow-y-auto">
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
                value={repaitformData.VehicleName}
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
                value={repaitformData.registrationNumber}
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
              value={repaitformData.issues}
              name="issues"
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {repaitformData.repairHistory.map((history, index) => (
            <div key={index} className="border border-gray-300 rounded-md p-4">
              <h3 className="text-lg font-semibold">Repair History</h3>

              <div className="flex flex-wrap gap-2">
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
                  required
                />
              </div>

              <h4 className="font-semibold mt-4">Parts</h4>
              {history.parts.map((part, partIndex) => (
                <div key={partIndex} className="border p-2 mb-2">
                  <div className="flex flex-wrap gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Part Number
                      </label>
                      <input
                        type="text"
                        name="partNumber"
                        value={part.partNumber}
                        onChange={(e) => handlePartChange(index, partIndex, e)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Part Name
                      </label>
                      <input
                        type="text"
                        name="partName"
                        value={part.partName}
                        onChange={(e) => handlePartChange(index, partIndex, e)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={part.price}
                        onChange={(e) => handlePartChange(index, partIndex, e)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Supplier
                      </label>
                      <input
                        type="text"
                        name="supplier"
                        value={part.supplier}
                        onChange={(e) => handlePartChange(index, partIndex, e)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddPart(index)}
                className="mt-2 bg-blue-500 text-white py-1 px-4 rounded-md"
              >
                Add Part
              </button>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Labour Hours
                </label>
                <input
                  type="number"
                  name="labourHours"
                  value={history.labourHours}
                  onChange={(e) => handleRepairHistoryChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Cost
                </label>
                <input
                  type="number"
                  name="cost"
                  value={history.cost}
                  onChange={(e) => handleRepairHistoryChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Signed Off By
                </label>
                <input
                  type="text"
                  name="signedOffBy"
                  value={history.signedOffBy}
                  onChange={(e) => handleRepairHistoryChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={history.date}
                  onChange={(e) => handleRepairHistoryChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageChange(index, e)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 bg-gray-300 text-gray-700 py-2 px-4 rounded-md ml-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
