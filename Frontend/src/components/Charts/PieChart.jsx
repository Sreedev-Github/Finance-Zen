import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";

function PieChart({pieData}) {
  const [options, setOptions] = useState({});
  const chartRef = useRef(null);

  const pieChartData = [
    {
      label: "Expense",
      amount: pieData.totalExpense
    },
    {
      label: "Income",
      amount: pieData.totalIncome
    },
    {
      label: "Saving",
      amount: pieData.totalSaving
    },
  ]

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
          labels: pieChartData.map((data) => data.label),
          datasets: [
            {
              label: "Amount",
              data: pieChartData.map((data) => data.amount),
              backgroundColor: [
                "rgba(220, 53, 69, 0.8)",
                "rgba(40, 167, 69, 0.8)",
                "rgba(0, 123, 255, 0.8)",
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
