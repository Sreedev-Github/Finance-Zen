import React from "react";
import AllTransactionTable from "../components/AllTransactionTable";

function AllTransactions() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-center text-3xl mt-10 mb-6">
          All your transactions at one place!
        </h1>
        <div className="w-[90%] m-auto">
          <AllTransactionTable />
        </div>
      </div>
    </>
  );
}

export default AllTransactions;
