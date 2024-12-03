"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const MultiSelectDropdown = () => {
  // Default selected options
  const defaultOptions = [
    { value: "airbags", label: "Airbags" },
    { value: "abs", label: "ABS" },
  ];

  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

  // Options for the dropdown
  const options = [
    { value: "airbags", label: "Airbags" },
    { value: "abs", label: "ABS" },
    { value: "stability_control", label: "Stability Control" },
    { value: "traction_control", label: "Traction Control" },
    { value: "blind_spot_monitoring", label: "Blind Spot Monitoring" },
    { value: "lane_departure_warning", label: "Lane Departure Warning" },
    { value: "adaptive_cruise_control", label: "Adaptive Cruise Control" },
    { value: "rearview_camera", label: "Rearview Camera" },
    { value: "parking_sensors", label: "Parking Sensors" },
    {
      value: "automatic_emergency_braking",
      label: "Automatic Emergency Braking",
    },
  ];

  // Function to handle selection changes
  const handleChange = (selected) => {
    setSelectedOptions(selected);
    const selectedValues = selected.map((option) => option.value);
    console.log("Selected Values:", selectedValues);
    saveToDatabase(selectedValues); // Save new selections to the database
  };

  // Function to save data to the database
  const saveToDatabase = async (selectedValues) => {
    try {
      await axios.post("/api/store-selection", { selectedValues });
      console.log("Selection saved to the database!");
    } catch (error) {
      console.error("Error saving selection:", error);
    }
  };

  // Save default selection to the database on component mount
  useEffect(() => {
    const defaultValues = defaultOptions.map((option) => option.value);
    saveToDatabase(defaultValues);
  }, []);

  return (
    <div className="w-64 mx-auto mt-10">
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Select features..."
        className="react-select"
        classNamePrefix="select"
      />
      <div className="mt-4">
        <strong>Selected Values:</strong>
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
