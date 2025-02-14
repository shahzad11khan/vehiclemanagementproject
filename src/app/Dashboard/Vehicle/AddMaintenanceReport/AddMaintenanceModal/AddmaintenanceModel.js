"use client";
import {
  API_URL_Vehicle_getspecificvehicleid,
  API_URL_Maintainance,
} from "@/app/Dashboard/Components/ApiUrl/ApiUrls";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getCompanyName,
  getUserId ,
  getUserName,getflag,getcompanyId
} from "@/utils/storageUtils";

const AddMaintenanceModal = ({ isOpen, onClose, fetchData, selectedid }) => {
  const [loading, setLoading] = useState(false);
  const [repaitformData, setrepaitformData] = useState({
    issues: "",
    vehicleName: "",
    registrationNumber: "",
    companyId:null,
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

  useEffect(() => {
    const storedcompanyName = getCompanyName() || getUserName();
    const userId = getUserId();
    const flag = getflag();
    const compID = getcompanyId();

    
    // Ensure that both storedcompanyName and userId are present before setting form data
    if (storedcompanyName && userId) {
      // Check if the company is "superadmin" and the flag is true
      if (storedcompanyName.toLowerCase() === "superadmin" && flag === "true" && compID) {
        setFormData((prevData) => ({
          ...prevData,
          adminCompanyName: storedcompanyName,
          companyId: compID, // Ensure compID is set
         }));
       } else {
         // Use userId if not in "superadmin" mode
         console.log(storedcompanyName, userId, flag, compID);
        setFormData((prevData) => ({
          ...prevData,
          adminCompanyName: storedcompanyName,
          companyId: userId,
        }));
      }
    } else {
      console.error("Missing required fields:", { storedcompanyName, userId, flag, compID });
    }
  }, []);

  console.log(repaitformData)
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
            vehicleName: data.model,
            registrationNumber: data.registrationNumber,
            adminCompanyName: data.adminCompanyName,
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
      formData.append("vehicleName", repaitformData.vehicleName);
      formData.append("registrationNumber", repaitformData.registrationNumber);
      formData.append("adminCompanyName", repaitformData.adminCompanyName);
      formData.append("adminCreatedBy", repaitformData.adminCreatedBy);
      formData.append("companyId", repaitformData.companyId);

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
      console.log("data is ", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        reset();
        fetchData(); // Refresh data on success
        onClose();
      } else {
        toast.warn(response.data.error);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
    } finally {
      setLoading(false);
    }
  };
  const reset = () => {
    setrepaitformData({
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
      <div className="p-12 rounded-xl shadow-lg w-full bg-white max-w-3xl max-h-[800px] overflow-y-auto">
        {/* <h2 className="text-3xl font-semibold text-center mb-2">
          Add Maintenance
        </h2> */}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Vehicle Maintenance
          </h2>

          <img src="/crossIcon.svg" className="cursor-pointer" onClick={() => {
            onClose();
            // setStep(1);
          }} />
        </div>
        <form onSubmit={handleSubmit}>
          <h1 className="font-bold">General Information</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4">
            <div className="w-full">
              <label className="text-[10px]">
                Vehicle Name
              </label>
              <input
                type="text"
                value={repaitformData.vehicleName}
                name="VehicleName"
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                readOnly
              />
            </div>

            <div className="w-full">
              <label className="text-[10px]">
                Registration Number
              </label>
              <input
                type="text"
                value={repaitformData.registrationNumber}
                name="VehicleRegistrationNumber"
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                readOnly
              />
            </div>

            <div className="w-full">
              <label className="text-[10px]">
                Assigned To
              </label>
              <input
                type="text"
                // value={repaitformData.registrationNumber}
                name="VehicleRegistrationNumber"
                // onChange={handleInputChange}
                className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                placeholder="Assigned To"
              />
            </div>
          </div>


          {repaitformData.repairHistory.map((history, index) => (


            <div key={index} className="">
              <h3 className="text-lg font-semibold">Maintenance Record</h3>

              <div >
                <label className="text-[10px]">
                  Issues / Damage
                </label>
                <input
                  // value={repaitformData.issues}
                  name="issues"
                  // onChange={handleInputChange}
                  className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4">
                <div>
                  <label className="text-[10px]">
                    Recovery
                  </label>
                  <input
                    type="text"
                    // name="organisation"
                    // value={history.organisation}
                    // onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                    required placeholder="Recovery"
                  />
                </div>


                <div>
                  <label className="text-[10px]">
                    Repair Status
                  </label>
                  <input
                    type="text"
                    name="repairStatus"
                    value={history.repairStatus}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow" placeholder="Repair Status"
                    required
                  />
                </div>


                <div>
                  <label className="text-[10px]">
                    Job Number
                  </label>
                  <input
                    type="text"
                    name="jobNumber"
                    value={history.jobNumber}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                    required placeholder="Job Number"
                  />
                </div>

                <div>
                  <label className="text-[10px]">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="organisation"
                    value={history.organisation}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                    required placeholder="Organization"
                  />
                </div>



                <div className="w-full">
                  <label className="text-[10px]">
                    Memo
                  </label>
                  <input
                    // value={history.memo}
                    name="memo"
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow" placeholder="Memo for repair"
                  />
                </div>

              </div>

              <h4 className="font-semibold mt-4">Parts (Add Multiple parts for repair)</h4>
              {history.parts.map((part, partIndex) => (
                <div key={partIndex}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4">
                    <div>
                      <label className="text-[10px]">
                        Part Number
                      </label>
                      <input
                        type="text"
                        name="partNumber"
                        value={part.partNumber}
                        onChange={(e) => handlePartChange(index, partIndex, e)}
                        className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px]">
                        Part Name
                      </label>
                      <input
                        type="text"
                        name="partName"
                        value={part.partName}
                        onChange={(e) => handlePartChange(index, partIndex, e)}
                        className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px]">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={part.price}
                        onChange={(e) => handlePartChange(index, partIndex, e)}
                        className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px]">
                        Supplier
                      </label>
                      <input
                        type="text"
                        name="supplier"
                        value={part.supplier}
                        onChange={(e) => handlePartChange(index, partIndex, e)}
                        className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                        placeholder="Supplier"
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

              <h4 className="font-semibold mt-4">Labour Cost</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-4">
                <div className="mt-4">
                  <label className="text-[10px]">
                    Labour Hours
                  </label>
                  <input
                    type="number"
                    name="labourHours"
                    value={history.labourHours}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                    required
                    placeholder="Labour Hours"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-[10px]">
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={history.cost}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                    required placeholder="Cost"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-[10px]">
                    Signed Off By
                  </label>
                  <input
                    type="text"
                    name="signedOffBy"
                    value={history.signedOffBy}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                    required placeholder="Signed Off By"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-[10px]">
                    Road Tax Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={history.date}
                    onChange={(e) => handleRepairHistoryChange(index, e)}
                    className="mt-1 block w-full border border-[#42506666] rounded p-2 shadow"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="text-[10px]">
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

            </div>
          ))}

          {/* <button
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
          </button> */}

          <div className="mt-6 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-1 px-5 w-full sm:w-auto border-[1px] rounded-4 border-[#313342] bg-white text-[#313342] hover:bg-gray-600 hover:text-white focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#313342] text-white rounded-4 hover:bg-gray-600 focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-500 py-1 px-8 $`}
            >
              {loading ? "Saving..." : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
