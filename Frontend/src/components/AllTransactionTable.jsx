import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "flowbite";

function AllTransactionTable() {
  const [tableData, setTableData] = useState([]);
const [selectedOption, setSelectedOption] = useState("All");
const [dropdownVisible, setDropdownVisible] = useState(false);
const [page, setPage] = useState(0);
const [totalData, setTotalData] = useState(0);
const transactionPerPage = 6;

const fetchUserData = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("No access token found");
    return;
  }

  const transactionTypeQuery = ["Expense", "Saving", "Income"].includes(selectedOption) 
    ? `&type=${selectedOption.toLowerCase()}` 
    : 'all';

  try {
    const response = await fetch(
      `${import.meta.env.VITE_DB_URL}/user/get-paged-transactions?p=${page}${transactionTypeQuery}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      const { data, total } = result.data;
      setTableData(data);
      setTotalData(total);
      return;
    } else {
      console.error("Failed to fetch data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

useEffect(() => {
  fetchUserData();
}, [selectedOption, page]);

const handleRadioChange = (event) => {
  setSelectedOption(event.target.value);
  setDropdownVisible(false); // Close dropdown on selection
};

const toggleDropdown = () => {
  setDropdownVisible(!dropdownVisible);
};

const handleNext = (e) => {
  e.preventDefault();
  setPage((p) => {
    return Math.max(p + 1); // Prevents page from going below 0
  });
};

const handlePrevious = (e) => {
  e.preventDefault();
  setPage((p) => {
    return Math.max(p - 1, 0); // Prevents page from going below 0
  });
};


  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
      <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
          <button
            id="dropdownRadioButton"
            onClick={toggleDropdown}
            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
          >
            <svg
              className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
            </svg>
            {selectedOption}
            <svg
              className="w-2.5 h-2.5 ms-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div
              id="dropdownRadio"
              className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              style={{
                position: "absolute",
                marginTop: "0.5rem",
              }}
            >
              <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                    <input
                      id="filter-radio-example-1"
                      type="radio"
                      value="All"
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedOption === "All"}
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor="filter-radio-example-1"
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      All
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id="filter-radio-example-2"
                      type="radio"
                      value="Expense"
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedOption === "Expense"}
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor="filter-radio-example-2"
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      Expense
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id="filter-radio-example-3"
                      type="radio"
                      value="Saving"
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedOption === "Last 30 days"}
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor="filter-radio-example-3"
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      Saving
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id="filter-radio-example-4"
                      type="radio"
                      value="Income"
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedOption === "Income"}
                      onChange={handleRadioChange}
                    />
                    <label
                      htmlFor="filter-radio-example-4"
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      Income
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Edit transaction
            </th>
            <th scope="col" className="px-6 py-3">
              Delete transaction
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((data, index) => {
              const date = new Date(data.date);
              const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear()}`;
              return (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {data.amount}
                  </th>
                  <td className="px-6 py-4">{formattedDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        data.type === "Expense"
                          ? "bg-expense-red"
                          : data.type === "Income"
                          ? "bg-income-green"
                          : "bg-saving-blue"
                      } text-white rounded-full p-1`}
                    >
                      {data.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{data.category}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/edit/${data.type.toLowerCase()}/${data._id}`}
                      onClick={(e) => handleEditClick(e, data._id, data.type)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      onClick={(e) => handleDeleteClick(e, data._id, data.type)}
                      className="cursor-pointer font-medium text-red-600 dark:text-blue-500 hover:underline"
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {`${(page * transactionPerPage) + 1} - ${Math.min((page + 1) * transactionPerPage, totalData)}`}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{totalData}</span>
      </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              disabled={page === 0}
              onClick={handlePrevious}
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border rounded-s-lg 
      ${
        page === 0
          ? "text-gray-300 bg-white dark:bg-gray-300 dark:border-gray-700 dark:text-gray-500 hover:cursor-not-allowed"
          : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      }`}
            >
              Previous
            </button>
          </li>
          <li>
            <button
              onClick={handleNext}
              disabled={totalData < (page + 1) * 10}
              className={`flex items-center justify-center px-3 h-8 leading-tight border rounded-e-lg 
      ${
        totalData < (page + 1) * 10
          ? "text-gray-300 bg-gray-200 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-500 hover:cursor-not-allowed"
          : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      }`}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AllTransactionTable;
