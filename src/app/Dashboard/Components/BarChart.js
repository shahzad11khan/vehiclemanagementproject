"use client";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChart = ({ data, data1 }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && data && data1) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Vehicles",
              data: data.values,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "#A6CE39",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Drivers",
              data: data1.values,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "#A6CE39",
              borderWidth: 2,
              fill: true,
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
  }, [data, data1]);

  return <canvas ref={chartRef} />;
};

export default LineChart;
