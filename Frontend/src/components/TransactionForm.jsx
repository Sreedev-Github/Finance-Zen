import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TransactionForm() {
  const [startDate, setStartDate] = useState(new Date());
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    method: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await fetch("http://localhost:3000/api/v1/expense/add-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log("Expense added successfully");
      } else {
        console.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkNumber = (e) => {
    const allowedKeys = [
      "Backspace", "Enter", "Control", "Meta", "Shift", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Tab"
    ];

    if (
      (e.key < "0" || e.key > "9") &&
      !allowedKeys.includes(e.key) &&
      !(e.ctrlKey || e.metaKey)
    ) {
      e.preventDefault();
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add a new transaction
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type your amount"
                required
                value={formData.amount}
                onChange={handleChange}
                onKeyDown={checkNumber}
              />
            </div>
            <div className="w-full">
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Food, subscription, clothes, etc"
                required
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Date
              </label>
              <DatePicker
                name="date"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="method" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Method of Payment
              </label>
              <select
                name="method"
                id="method"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={formData.method}
                onChange={handleChange}
              >
                <option value="">Select method of payment</option>
                <option value="cash">Cash</option>
                <option value="credit card">Credit card</option>
                <option value="UPI">UPI</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="8"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Your description here"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-twitter-blue rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </section>
  );
}

export default TransactionForm;
