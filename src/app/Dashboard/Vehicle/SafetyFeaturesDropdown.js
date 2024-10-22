import { useState } from "react";

const SafetyFeaturesDropdown = ({ vehicleData, handleCheckboxChange }) => {
  const options = [
    "Airbags",
    "ABS (Anti-lock Braking System)",
    "Stability Control",
    "Traction Control",
    "Blind Spot Monitoring",
    "Lane Departure Warning",
    "Adaptive Cruise Control",
    "Rearview Camera",
    "Parking Sensors",
    "Automatic Emergency Braking",
  ];

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full sm:w-auto">
      <div className="flex">
        <label className="block font-semibold">Safety Features</label>
        <span className="text-red-600">*</span>
      </div>
      {/* Button to toggle the dropdown */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full p-2 border border-gray-300 rounded bg-white text-left md:text-base text-sm"
      >
        {vehicleData.safetyFeatures.length > 0
          ? vehicleData.safetyFeatures.join(", ")
          : "Select safety features"}
      </button>

      {/* Dropdown with checkboxes */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label key={option} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={vehicleData.safetyFeatures.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="mr-2"
              />
              <span className="text-sm md:text-base">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyFeaturesDropdown;
