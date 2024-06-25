import React, { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import { useParams, useNavigate } from 'react-router-dom';

function EditTransaction() {
  const [originalTransaction, setOriginalTransaction] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { transactionType, transactionId } = useParams();
  const navigate = useNavigate();

  // Fetch original transaction
  const fetchTransaction = async () => {
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
        const data = await response.json();
        setOriginalTransaction(data.data);
      } else {
        console.error("Failed to find transaction");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Changes Submit Method
  const handleUpdateSubmit = async (formData, startDate, selectedOption) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    // Check if the form data has changed
    const payload = {
      ...formData,
      date: startDate
    };

    const originalPayload = {
      amount: originalTransaction.amount,
      category: originalTransaction.category,
      method: originalTransaction.method,
      description: originalTransaction.description,
      date: new Date(originalTransaction.date)
    };

    if (JSON.stringify(payload) === JSON.stringify(originalPayload)) {
      setAlertMessage("No changes have been made yet");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
        setAlertType("");
      }, 2000);
      return;
    }

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
        navigate("/user", { state: { alertMessage: `${selectedOption} has been updated successfully`, alertType: "success" } });
      } else {
        navigate("/user", { state: { alertMessage: `Failed to update ${selectedOption}`, alertType: "error" } });
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/user", { state: { alertMessage: "An error occurred while updating", alertType: "error" } });
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
    setAlertType("");
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  return (
    <div>
      {showAlert && (
        <div className={`alert ${alertType} ${showAlert ? "show" : ""}`}>
          {alertMessage}
          <button className="close-btn" onClick={handleCloseAlert}>
          <i class="fa-solid fa-x"></i>
          </button>
        </div>
      )}
      <h1 className="text-center text-3xl mt-10 mb-6">Edit your {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</h1>
      <TransactionForm onSubmit={handleUpdateSubmit} btnText="Update Transaction" editForm={true} data={{...originalTransaction, type: transactionType}} setHasChanges={setHasChanges} />
    </div>
  );
}

export default EditTransaction;
