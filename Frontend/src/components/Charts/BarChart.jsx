import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart() {
  const [barData, setBarData] = useState([]);

  const fetchBarData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DB_URL}/user/transactions/7/expense`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        let data = await response.json();
        setBarData(data.data);
        return;
      } else {
        console.error("Failed to fetch bar data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchBarData();
  }, []);

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
              grid: {
                display: false,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
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
            grid: {
              display: false,
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      });
      // Manually trigger chart resize
      if (chartRef.current) {
        chartRef.current.resize();
      }
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
    <div className="md:w-auto md:h-auto relative">
      {" "}
      {/* Set a maximum height */}
      <Bar
        ref={chartRef}
        data={{
          labels: barData.map((data) => {
            let date = new Date(data.date);
            date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            return date.toLocaleDateString();
          }),
          datasets: [
            {
              label: "Amount",
              data: barData.map((data) => data.amount),
              backgroundColor: [
                "rgba(220, 53, 69, 0.8)",
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
