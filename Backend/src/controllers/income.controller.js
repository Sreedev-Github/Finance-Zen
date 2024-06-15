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

export {
    addIncome,
    updateIncome,
    deleteIncome
}
