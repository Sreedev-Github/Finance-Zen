import React from "react";

import FinanceChart from "./Chart";

const DashboardLayout = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {/* Graph - Large: col-span-2 row-span-2, Medium: col-span-2, Small: full-width */}
        <div
          className="bg-white-800 text-white p-8 rounded-lg flex items-center justify-center sm:col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 border-solid border-2 shadow-xl "
        >
          <FinanceChart />
        </div>
        {/* IDK rn - Large: col-span-1, row-span-1, Small/Medium: full-width */}
        <div className="bg-gray-600 text-white p-4 rounded-lg flex items-center justify-center sm:col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1">
          IDK rn
        </div>
        {/* Expense Breakdown - Large: col-span-1, row-span-1, Small/Medium: full-width */}
        <div className="bg-gray-400 text-white p-4 rounded-lg flex items-center justify-center sm:col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1">
          Expense Breakdown
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
