import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Income } from "../models/income.model.js";

const addIncome = asyncHandler(async (req, res) => {
  const { amount, method, category, description = "", date = Date.now() } = req.body;

  if ([amount, method, category, date].some(field => !field || (typeof field === 'string' && !field.trim()))) {
    throw new ApiError(400, "All fields are required");
  }

  const newIncome = await Income.create({
    user: req?.user._id,
    amount,
    method,
    category,
    description,
    date,
  });

  if (!newIncome) {
    throw new ApiError(
      500,
      "Something went wrong while trying to upload your income"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newIncome,
        "You income has been added successfully"
      )
    );
});

// get Income
const getIncome = asyncHandler(async(req, res)=>{
  if(!req.params.incomeId){
    throw new ApiError(400, "Income Id is not provided");
  }
  const { incomeId } = req.params;

  const income = await Income.findById(incomeId)

  if(!income){
    throw new ApiError(404, "No income found with the provided Id");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, income, "Your income has been fetched successfully"))

})

// update income
const updateIncome = asyncHandler(async (req, res) => {
  if (!req.params?.incomeId) {
    throw new ApiError(400, "Income Id is required");
  }

  const { incomeId } = req.params;

  const { amount, method, category, description = "", date } = req.body;

  if ([amount, method, category, date].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const newUpdatedIncome = await Income.findByIdAndUpdate(
    incomeId,
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

  if (!newUpdatedIncome) {
    throw new ApiError(
      500,
      "Something went wrong while trying to upload your income"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newUpdatedIncome,
        "You income has been updated successfully"
      )
    );
});

// Delete Income
const deleteIncome = asyncHandler(async (req, res) => {
  if (!req.params.incomeId) {
    throw new ApiError(400, "Income Id is required");
  }

  const { incomeId } = req.params;

  const deletedIncome = await Income.findByIdAndDelete(incomeId);

  if (!deletedIncome){
    throw new ApiError(500, "Something went wrong while trying to delete  your income");
  }

  return res
  .status(200)
  .json(new ApiResponse(200, deletedIncome, "Your income has been deleted successully"));
});

const getAllIncomeInOrder = asyncHandler(async (req, res) => {
  let { count } = req.params;

  // Check if count is "all"
  if (count === "all") {
    // Fetching all expenses
    let incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id")
      .lean();

    if (!incomes) {
      throw new ApiError(
        500,
        "Something went wrong while trying to fetch expenses"
      );
    }

    // Add type property to each expense
    incomes = incomes.map((income) => ({ ...income, type: "Income" }));

    return res
      .status(200)
      .json(
        new ApiResponse(200, incomes, "All transactions fetched successfully")
      );
  } else {
    // Parse count as an integer
    count = parseInt(count);

    if (!count || isNaN(count) || count < 1) {
      throw new ApiError(400, "Invalid number of transactions provided");
    }

    const numberOfIncome = parseInt(count);

    // Fetching the last n expenses
    let incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(numberOfIncome)
      .select("date amount category _id")
      .lean();
      // .lean() = This tells Mongoose to return plain JavaScript objects instead of Mongoose documents.

    if (!incomes) {
      throw new ApiError(
        500,
        "Something went wrong while trying to fetch Incomes"
      );
    }

    // Add type property to each expense
    incomes = incomes.map((income) => ({ ...income, type: "income" }));

    return res
      .status(200)
      .json(
        new ApiResponse(200, incomes, "Transactions fetched successfully")
      );
  }
});

export {
    addIncome,
    updateIncome,
    deleteIncome,
    getIncome,
    getAllIncomeInOrder
}
