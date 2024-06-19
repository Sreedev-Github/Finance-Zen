import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { chartData } from "../../utils/chartData.js";

function PieChart() {
  const [options, setOptions] = useState({});
  const chartRef = useRef(null);

  const updateOptions = () => {
    const width = window.innerWidth;

    setOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: width >= 768,
        },
      },
    });

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
    <div className="md:w-auto lg:max-h-[250px] items-center relative">
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
            },
          ],
        }}
        options={options}
      />
    </div>
  );
}

export default PieChart;
