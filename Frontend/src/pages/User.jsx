import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Table from "../components/Table";
import { useLocation } from "react-router-dom";

function User() {
  const [financialData, setFinancialData] = useState({
    totalExpense: 0,
    totalIncome: 0,
    totalSaving: 0,
  });
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_DB_URL}/user/finance-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFinancialData({
          totalExpense: data.data.totalExpense,
          totalIncome: data.data.totalIncome,
          totalSaving: data.data.totalSaving,
        });
        return;
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    if (location.state && location.state.alertMessage) {
      setAlertMessage(location.state.alertMessage);
      setAlertType(location.state.alertType);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
        setAlertType("");
      }, 2000);
    }
  }, [location.state]);

  const handleCloseAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
    setAlertType("");
  };

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
      {/* Text-Data */}
      <div className="flex w-full justify-around my-10">
        <div className="bg-blue-400 text-white rounded-xl text-center p-4 md:p-8 lg:px-20 md:px-14">
          <p>Expense</p>
          <p className="italic">₹ {financialData.totalExpense}</p>
        </div>
        <div className="bg-blue-400 text-white rounded-xl text-center p-4 md:p-8 lg:px-20 md:px-14">
          <p>Income</p>
          <p>₹ {financialData.totalIncome}</p>
        </div>
        <div className="bg-blue-400 text-white rounded-xl text-center p-4 md:p-8 lg:px-20 md:px-14">
          <p>Saving</p>
          <p>₹ {financialData.totalSaving}</p>
        </div>
      </div>

      {/* Dashboard Layout */}
      <DashboardLayout pieData={financialData} />

      <Table />
    </div>
  );
}

export default User;
