import React from "react";
import BarChart from "./Charts/BarChart";
import PieChart from "./Charts/PieChart";
import DashboardTable from "./Charts/DashboardTable";

const DashboardLayout = ({pieData}) => {
  return (
    <div className="dashboard-wrapper container mx-auto p-4 flex justify-center">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {/* Bar Chart */}
        <div className="dashboardBox bg-white text-black p-4 rounded-lg flex items-center justify-center col-span-full md:col-span-2 lg:col-span-2 lg:row-span-2 border-solid border-2 shadow-xl">
          <div className="w-full h-full overflow-hidden flex flex-col justify-around mx-auto">
            <h1 className="text-2xl md:text-3xl text-slate-800 text-center mb-4">Last few Expenses</h1>
            <BarChart />
          </div>
        </div>
        {/* Pie Chart */}
        <div className="dashboardBox bg-white text-black p-4 rounded-lg flex items-center justify-center col-span-full md:col-span-1 lg:col-span-1 lg:row-span-1 border-solid border-2 shadow-xl">
          <div className="w-full h-full overflow-hidden flex flex-col justify-around">
            <h1 className="text-2xl text-black text-center mb-4">Overall Finance</h1>
            <PieChart pieData={pieData}/>
          </div>
        </div>
        {/* Dashboard Table */}
        <div className="dashboardBox bg-white text-black p-4 rounded-lg flex items-center justify-center col-span-full md:col-span-1 lg:col-span-1 lg:row-span-1 border-solid border-2 shadow-xl">
          <div className="w-full h-full overflow-hidden flex flex-col justify-around">
            <h1 className="text-2xl text-black text-center mb-4">Top Expenses</h1>
            <DashboardTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
