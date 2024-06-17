// components/LineChart.js
import React from "react";
import {Chart as ChartJS} from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";
import { chartData } from "../utils/chartData.js";

function FinanceChart() {

    (function(){

    })

  return (
    <>
    <Bar
    data={{
        labels: chartData.map((data) => data.label),
        datasets: [
            {
                label: "Count",
                data: chartData.map((data)=> data.value),
                backgroundColor: [
                    "rgba(43, 63, 229, 0.8)",
                    "rgba(250, 192, 19, 0.8)",
                    "rgba(253, 135, 135, 0.8)",
                ],
                borderRadius: 5,
            },
        ]
    }}/>
    </>
  );
}
export default FinanceChart;