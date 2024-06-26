import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Table from "../components/Table";
import { useLocation, useNavigate } from "react-router-dom";

function User() {
  const [financialData, setFinancialData] = useState({
    totalExpense: 0,
    totalIncome: 0,
    totalSaving: 0,
  });
  const location = useLocation();
  const navigate = useNavigate();
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

        // Check if there's an alert message in sessionStorage
        const storedAlertMessage = sessionStorage.getItem("alertMessage");
        if (storedAlertMessage) {
          setAlertMessage(storedAlertMessage);
            setAlertType(sessionStorage.getItem("alertType") || "success");
            setShowAlert(true);
          setTimeout(() => {
            setAlertMessage("");
            setAlertType("");
            setShowAlert(false);
          }, 2000);
          // Clear sessionStorage after displaying the alert
          sessionStorage.removeItem("alertMessage");
          sessionStorage.removeItem("alertType");
        }
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (location.state && location.state.alertMessage) {
      // Store alert message and type in sessionStorage
      sessionStorage.setItem("alertMessage", location.state.alertMessage);
      sessionStorage.setItem(
        "alertType",
        location.state.alertType || "success"
      );

      // Redirect to the same location without state to prevent showing on refresh
      navigate(location.pathname);

      // Clear the alert after 3 seconds
      const timeout = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage("");
        setAlertType("");
        sessionStorage.removeItem("alertMessage");
        sessionStorage.removeItem("alertType");
      }, 2000);

      // Cleanup function to clear timeout on component unmount or when location state changes
      return () => clearTimeout(timeout);
    }
  }, [location.state, navigate]);

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
            <i className="fa-solid fa-x"></i>
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
