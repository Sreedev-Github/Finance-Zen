import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Expense } from "../models/expense.model.js";

const addExpense = asyncHandler(async (req, res) => {
  const {
    amount,
    method,
    category,
    description = "",
    date = Date.now(),
  } = req.body;

  if (
    [amount, method, category, date].some(
      (field) => !field || (typeof field === "string" && !field.trim())
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const newExpense = await Expense.create({
    user: req?.user._id,
    amount,
    method,
    category,
    description,
    date,
  });

  if (!newExpense) {
    throw new ApiError(
      500,
      "Something went wrong while trying to add your expense"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newExpense,
        "You expense has been added successfully"
      )
    );
});

// update expense
const updateExpense = asyncHandler(async (req, res) => {
  if (!req.params.expenseId) {
    throw new ApiError(400, "Expense Id is required");
  }

  const { expenseId } = req.params;

  const { amount, method, category, description = "", date } = req.body;

  if ([amount, method, category, date].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const newUpadtedExpense = await Expense.findByIdAndUpdate(
    expenseId,
    {
      $set: {
        amount,
        method,
        category,
        description,
        date,
      },
    },
    { new: true }
  );

  if (!newUpadtedExpense) {
    throw new ApiError(
      500,
      "Something went wrong while trying to upload your expense"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newUpadtedExpense,
        "You expense has been updated successfully"
      )
    );
});

// Delete Expense
const deleteExpense = asyncHandler(async (req, res) => {
  if (!req.params?.expenseId) {
    throw new ApiError(400, "Expense Id is required");
  }

  const { expenseId } = req.params;

  const deletedExpense = await Expense.findByIdAndDelete(expenseId);

  if (!deletedExpense) {
    throw new ApiError(
      500,
      "Something went wrong while trying to delete  your expense"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedExpense,
        "Your expense has been deleted successully"
      )
    );
});

export { addExpense, updateExpense, deleteExpense };
