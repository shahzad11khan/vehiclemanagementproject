"useclient";
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
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full p-2 border border-gray-300 rounded"
      >
        {vehicleData.safetyFeatures.length > 0
          ? vehicleData.safetyFeatures.join(", ")
          : "Select safety features"}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          {options.map((option) => (
            <label key={option} className="flex items-center p-2">
              <input
                type="checkbox"
                checked={vehicleData.safetyFeatures.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyFeaturesDropdown;
