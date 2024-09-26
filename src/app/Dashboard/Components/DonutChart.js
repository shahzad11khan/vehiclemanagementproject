"use client";
// components/AreaChart.js
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const AreaChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart instance
      }

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "line", // Set chart type to line
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Clients",
              data: data.values,
              backgroundColor: "rgba(166, 206, 57, 0.5)", // Adjust color as needed
              borderColor: "#A6CE39", // Adjust color as needed
              borderWidth: 2,
              fill: true, // Fill the area under the line
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default AreaChart;
