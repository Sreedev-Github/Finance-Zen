import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { chartData } from "../../utils/chartData.js";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart() {
  const [options, setOptions] = useState({});
  const chartRef = useRef(null);

  const updateOptions = () => {
    const width = window.innerWidth;

    if (width < 768) {
      setOptions({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              grid:{
                display: false
            }
            },
          },
          y: {
            beginAtZero: true,
            grid:{
              display: false
          },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      });
    } else {
      setOptions({
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            display: true,
            ticks: {
              autoSkip: true,
            },
            grid:{
              display: false
          },
          },
          y: {
            display: true,
            beginAtZero: true,
            grid:{
              display: false
          },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      });
    }

    // Manually trigger chart resize
    if (chartRef.current) {
      chartRef.current.resize();
    }
  };

  useEffect(() => {
    updateOptions();
    window.addEventListener("resize", updateOptions);

    return () => {
      window.removeEventListener("resize", updateOptions);
    };
  }, []);

  return (
    <div className="w-full sm:max-h-[700px]"> {/* Set a maximum height */}
    <h1 className="text-2xl text-black text-center mb-4">Bar Chart</h1>
      <Bar
        ref={chartRef}
        data={{
          labels: chartData.map((data) => data.label),
          datasets: [
            {
              label: "Count",
              data: chartData.map((data) => data.value),
              backgroundColor: [
                "rgba(43, 63, 229, 0.8)",
                "rgba(250, 192, 19, 0.8)",
                "rgba(253, 135, 135, 0.8)",
              ],
              borderRadius: 5,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
}

export default BarChart;
