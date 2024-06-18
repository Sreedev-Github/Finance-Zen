import React from "react";
import BarChart from "./Charts/BarChart";
import PieChart from "./Charts/PieChart";
import DashboardTable from "./Charts/DashboardTable";

const DashboardLayout = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {/* Bar Chart - Large: col-span-2 row-span-2, Medium: col-span-2, Small: full-width */}
        <div className="bg-white text-black p-4 rounded-lg flex items-center justify-center sm:col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 border-solid border-2 shadow-xl">
          <BarChart />
        </div>
        {/* Pie Chart - Large: col-span-1, row-span-1, Small/Medium: full-width */}
        <div className="bg-white text-black p-4 rounded-lg flex items-center justify-center sm:col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1 border-solid border-2 shadow-xl">
          <PieChart />
        </div>
        {/* Dashboard Table - Large: col-span-1, row-span-1, Small/Medium: full-width */}
        <div className="bg-white text-black p-4 rounded-lg flex items-center justify-center sm:col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1 border-solid border-2 shadow-xl">
          <div className="w-full h-full overflow-hidden">
            <h1 className="text-2xl text-black text-center mb-4">Top Financial Activities</h1>
            <DashboardTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
