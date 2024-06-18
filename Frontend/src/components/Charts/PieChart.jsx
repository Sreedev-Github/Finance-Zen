import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { chartData } from "../../utils/chartData.js";
import { Chart as ChartJS } from "chart.js/auto";

function PieChart() {
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
                display: false,
                ticks: {
                  autoSkip: true,
                },
                grid:{
                    display: false
                },
              },
          y: {
            display: false,
            beginAtZero: true,
            grid:{
                display: false
            }
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
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
            ticks: {
              autoSkip: true,
            },
            grid:{
                display: false
            }
          },
          y: {
            display: false,
            beginAtZero: true,
            grid:{
                display: false
            }
          },
        },
        plugins: {
          legend: {
            display: false,
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
    <div className="flex flex-col">
    <h1 className="text-2xl text-black text-center mb-4">Pie Chart</h1>

    <div className="w-full lg:max-h-[350px] items-center relative"> {/* Set a maximum height */}
      <Pie 
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
              borderColor:"rgba(, 0, 0, 0.5)"
            },
          ],
        }}
        options={options}
      />
    </div>
    </div>
  );
}

export default PieChart;
