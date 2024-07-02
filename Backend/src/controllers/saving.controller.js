import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Saving } from "../models/saving.model.js";

const addSaving = asyncHandler(async (req, res) => {
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

  const newSaving = await Saving.create({
    user: req?.user._id,
    amount,
    method,
    category,
    description,
    date,
  });

  if (!newSaving) {
    throw new ApiError(
      500,
      "Something went wrong while trying to upload your saving"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, newSaving, "You saving has been added successfully")
    );
});

// get saving
const getSaving = asyncHandler(async (req, res) => {
  if (!req.params.savingId) {
    throw new ApiError(400, "Saving Id is not provided");
  }
  const { savingId } = req.params;

  const saving = await Saving.findById(savingId);

  if (!saving) {
    throw new ApiError(404, "No saving found with the provided Id");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, saving, "Your saving has been fetched successfully")
    );
});

// update saving
const updateSaving = asyncHandler(async (req, res) => {
  if (!req.params.savingId) {
    throw new ApiError(400, "Saving Id is required");
  }

  const { savingId } = req.params;

  const { amount, method, category, description = "", date } = req.body;

  if ([amount, method, category, date].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const newUpdatedSaving = await Saving.findByIdAndUpdate(
    savingId,
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

  if (!newUpdatedSaving) {
    throw new ApiError(
      500,
      "Something went wrong while trying to upload your saving"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newUpdatedSaving,
        "You saving hasbeen updated successfully"
      )
    );
});

// Delete Saving
const deleteSaving = asyncHandler(async (req, res) => {
  if (!req.params.savingId) {
    throw new ApiError(400, "Saving Id is required");
  }

  const { savingId } = req.params;

  const deletedSaving = await Saving.findByIdAndDelete(savingId);

  if (!deletedSaving) {
    throw new ApiError(
      500,
      "Something went wrong while trying to delete your saving"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedSaving,
        "Your saving has been deleted successully"
      )
    );
});

export { addSaving, updateSaving, deleteSaving, getSaving };
