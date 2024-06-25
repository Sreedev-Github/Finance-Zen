import React from "react";
import TransactionForm from "../components/TransactionForm";
import { useNavigate } from "react-router-dom";

function AddTransaction() {

  const navigate = useNavigate(); 

  const handleSubmit = async (formData, startDate, selectedOption) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    const payload = {
      ...formData,
      date: startDate
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_DB_URL}/${selectedOption}/add-${selectedOption}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate("/user", { state: { alertMessage: `${selectedOption} has been added successfully`, alertType: "success" } });
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <div>
      <h1 className="text-center text-3xl mt-10 mb-6">Add your Transaction</h1>
      <TransactionForm onSubmit={handleSubmit} btnText ="Add Transaction" editForm={false}/>
    </div>
  );
}

export default AddTransaction;