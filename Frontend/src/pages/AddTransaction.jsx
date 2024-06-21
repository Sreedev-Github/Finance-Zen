import React from "react";
import TransactionForm from "../components/TransactionForm";

function AddTransaction() {

  return (
    <div>
      <h1 className="text-center text-3xl mt-10 mb-6">Add your Transaction</h1>
      <TransactionForm />
    </div>
  );
}

export default AddTransaction;