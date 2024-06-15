import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js";
import { Income } from "../models/income.model.js";
import { Saving } from "../models/saving.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const checkExisitingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (checkExisitingUser) {
    throw new ApiError(409, "User already exists in our website");
  }

  const user = await User.create({
    email,
    password,
    username,
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Created succesfully"));
});

// Generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // Find User
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate Access and Refresh Token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Add refresh token to the user
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while geenrating Access and Refresh Tokens"
    );
  }
};

// Login User
// TODO:- Prevent the user from loggin in while he is already logged in.

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  // Search and validate User

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  //   Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Cookie options
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in Successfully"
      )
    );
});

const addProfile = asyncHandler(async (req, res) => {
  // Get the details from the form
  const { firstName, lastName, dateOfBirth, address } = req.body;

  if (
    [firstName, lastName, dateOfBirth, address].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const user = User.findByIdAndUpdate(
    req?.user._id,
    {
      set: {
        profile: { firstName, lastName, dateOfBirth, address },
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(
      500,
      "Something went wrong while updating the user details"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User details have been updated successfully")
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  // Remove refreshToken from the user
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      // returns the new value of the user which has refreshToken undefined
      new: true,
    }
  );

  // Clear cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User successfully logged Out"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findOne(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// Get total finance details
const getUserFinancialData = asyncHandler(async (req, res) => {
  // const userId = new mongoose.Types.ObjectId(req?.user._id);

  const totalIncome = await Income.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
  ]);

  const totalExpense = await Expense.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
  ]);

  const totalSaving = await Saving.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
  ]);

  const userFinancialData = {
    totalIncome: totalIncome[0]?.totalAmount || 0,
    totalExpense: totalExpense[0]?.totalAmount || 0,
    totalSaving: totalSaving[0]?.totalAmount || 0,
  };

  console.log(userFinancialData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userFinancialData,
        "User financial data has  been fetchedd successfully"
      )
    );
});

// Fetch transactions for the last n days
const getTransactionsForLastNDays = asyncHandler(async (req, res) => {
  const { days } = req.params;

  if (!days || isNaN(days) || days < 1) {
    throw new ApiError(400, "Invalid number of days provided");
  }

  const numberOfDays = parseInt(days);
  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  pastDate.setDate(pastDate.getDate() - numberOfDays);

  // Fetching expenses
  const expenses = await Expense.find({
    user: req.user._id,
    date: { $gte: pastDate, $lte: currentDate },
  }).select("date amount -_id");

  // Fetching income
  const incomes = await Income.find({
    user: req.user._id,
    date: { $gte: pastDate, $lte: currentDate },
  }).select("date amount -_id");

  // Fetching savings
  const savings = await Saving.find({
    user: req.user._id,
    date: { $gte: pastDate, $lte: currentDate },
  }).select("date amount -_id");

  const transactions = {
    expenses,
    incomes,
    savings,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, transactions, "Transactions fetched successfully"));
});


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  addProfile,
  getUserFinancialData,
  getTransactionsForLastNDays
};
