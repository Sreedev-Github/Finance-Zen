import React, {useEffect, useState} from "react";
import TransactionForm from "../components/TransactionForm";
import { useParams } from 'react-router-dom';

function EditTransaction() {

  const [originalTransaction, setOriginalTransaction] = useState({});

  const { transactionType, transactionId } = useParams();

//  Fetch original transaction
 const fetchTransaction = async() => {

  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("No access token found");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_DB_URL}/${transactionType}/get${transactionType}/${transactionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    if (response.ok) {
      const data = await response.json()
      setOriginalTransaction(data.data)
    } else {
      console.error("Failed to find transaction");
    }
  } catch (error) {
    console.error("Error:", error);
  }
 }


//  Chnages Submit Method
  const handleUpdateSubmit = async (formData, startDate, selectedOption) => {
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
      const response = await fetch(`${import.meta.env.VITE_DB_URL}/${selectedOption}/update-${selectedOption}/${transactionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`${selectedOption} updated successfully`);
      } else {
        console.error("Failed to update transaction changes");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTransaction();
  },[])
  

  return (
    <div>
      <h1 className="text-center text-3xl mt-10 mb-6">Edit your {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</h1>
      <TransactionForm  onSubmit={handleUpdateSubmit} btnText ="Update Transaction" editForm={true} data={{...originalTransaction, type: transactionType}}/> 
    </div>
  );
}

export default EditTransaction;