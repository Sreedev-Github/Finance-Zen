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


// get expense
const getExpense = asyncHandler(async(req, res)=>{
  if(!req.params.expenseId){
    throw new ApiError(400, "Expense Id is not provided");
  }
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId)

  if(!expense){
    throw new ApiError(404, "No expense found with the provided Id");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, expense, "Your expense has been fetched successfully"))

})

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

const highestExpenses = asyncHandler(async(req, res)=>{
  const topExpenses = await Expense.find({ user: req.user._id })
    .sort({ amount: -1 })
    .limit(3)
    .select("date amount category -_id");

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        topExpenses,
        "Your top expenses has been fetched successully"
      )
    );
})

export { addExpense, updateExpense, deleteExpense, highestExpenses, getExpense };
