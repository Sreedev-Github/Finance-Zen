import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TransactionForm({ onSubmit, btnText, editForm: initialEditForm, data }) {
  const [editForm, setEditForm] = useState(initialEditForm);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("expense");
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    method: "",
    description: ""
  });
  const [methodOfPayment, setMethodOfPayment] = useState(["Cash", "Credit Card", "UPI", "other"]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, startDate, selectedOption);
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

  const selectRadio = (e) => {
    if (!editForm) {
      setSelectedOption(e.target.name);
    }
  };

  useEffect(() => {
    if (editForm) {
      setFormData({
        amount: data.amount || "",
        category: data.category || "",
        method: data.method || "",
        description: data.description || ""
      });

      // Safely parse the date
      const parsedDate = new Date(data.date);
      if (!isNaN(parsedDate.getTime())) {
        setStartDate(parsedDate);
      } else {
        console.error("Invalid date value:", data.date);
      }

      setSelectedOption(data.type);
    }

    if (selectedOption === "expense") {
      setMethodOfPayment(["Cash", "Credit card", "UPI", "Other"]);
    } else if (selectedOption === "income") {
      setMethodOfPayment(["Cash", "Bank credit", "Other"]);
    } else {
      setMethodOfPayment(["Bank account", "Investment", "Mutual funds", "Other"]);
    }
  }, [selectedOption, editForm, data]);

  return (
    <>
      <div className="px-4 mx-auto max-w-2xl py-4">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Select your transaction type</h3>
        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <li className={`w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 rounded-l-md ${editForm && selectedOption !== "expense" ? "bg-gray-300" : ""}`}>
            <div className="flex items-center ps-3" onClick={selectRadio} name="expense">
              <input checked={selectedOption === "expense"} id="horizontal-list-radio-expense" type="radio" value="" name="expense" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" disabled={editForm && selectedOption !== "expense"} />
              <label htmlFor="horizontal-list-radio-expense" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Expense</label>
            </div>
          </li>
          <li className={`w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 ${editForm && selectedOption !== "income" ? "bg-gray-300" : ""}`}>
            <div className="flex items-center ps-3" onClick={selectRadio}>
              <input
                checked={selectedOption === "income"}
                id="horizontal-list-radio-income"
                type="radio"
                value=""
                name="income"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                disabled={editForm && selectedOption !== "income"}
              />
              <label htmlFor="horizontal-list-radio-income" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Income</label>
            </div>
          </li>
          <li className={`w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 rounded-r-md ${editForm && selectedOption !== "saving" ? "bg-gray-300" : ""}`}>
            <div className="flex items-center ps-3" onClick={selectRadio}>
              <input checked={selectedOption === "saving"} id="horizontal-list-radio-saving" type="radio" value="" name="saving" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" disabled={editForm && selectedOption !== "saving"} />
              <label htmlFor="horizontal-list-radio-saving" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Saving</label>
            </div>
          </li>
        </ul>
      </div>

      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-3 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Amount
                </label>
                <input
                  type="text"
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
                  <option value={methodOfPayment[0]}>{methodOfPayment[0]}</option>
                  <option value={methodOfPayment[1]}>{methodOfPayment[1]}</option>
                  <option value={methodOfPayment[2]}>{methodOfPayment[2]}</option>
                  <option className={methodOfPayment[3] ? "block" : "hidden"} value={methodOfPayment[3]}>{methodOfPayment[3]}</option>
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
              {btnText}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default TransactionForm;
