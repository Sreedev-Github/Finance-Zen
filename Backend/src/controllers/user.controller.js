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
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    throw new ApiError(400, "Username and password are required");
  }

  const checkExistingUser = await User.findOne({ username });

  if (checkExistingUser) {
    throw new ApiError(409, "User already exists in our website");
  }

  const user = await User.create({ username, password });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Created successfully"));
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
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  };

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
    .json(
      new ApiResponse(200, transactions, "Transactions fetched successfully")
    );
});

// Fetch transactions for the last n days
const getSpecificTransactionsForLastNTransactions = asyncHandler(
  async (req, res) => {
    const { count } = req.params;
    const { type } = req.params;

    if (!count || isNaN(count) || count < 1) {
      throw new ApiError(400, "Invalid number of transactions provided");
    }

    if (!type) {
      throw new ApiError(400, "Please provide a type of transaction");
    }

    const numberOfTransactions = parseInt(count);

    // Fetching the last n expenses
    if (type === "expense") {
      const expenses = await Expense.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(numberOfTransactions)
        .select("date amount -_id");

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            expenses.reverse(),
            "Expenses fetched successfully"
          )
        );
    }

    // Fetching the last n incomes
    if (type.lowercase() === "income") {
      const incomes = await Income.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(numberOfTransactions)
        .select("date amount -_id");

      return res
        .status(200)
        .json(new ApiResponse(200, incomes, "Incomes fetched successfully"));
    }

    // Fetching the last n savings
    if (type.lowercase() === "saving") {
      const savings = await Saving.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(numberOfTransactions)
        .select("date amount -_id");

      return res
        .status(200)
        .json(new ApiResponse(200, savings, "Savings fetched successfully"));
    }

    throw new ApiError(500, "Something went wrong!");
  }
);

const getAllTransactionsInOrder = asyncHandler(async (req, res) => {
  let { count } = req.params;

  // Check if count is "all"
  if (count === "all") {

    const page = req.query.p || 1
    const transactionPerPage = 10

    // Fetching all expenses
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");

    // Fetching all incomes
    const incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");

    // Fetching all savings
    const savings = await Saving.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");

    // Combine and sort by date
    const transactions = [
      ...expenses.map((transaction) => ({
        type: "Expense",
        ...transaction._doc,
      })),
      ...incomes.map((transaction) => ({ type: "Income", ...transaction._doc })),
      ...savings.map((transaction) => ({ type: "Saving", ...transaction._doc })),
    ].sort((a, b) => b.date - a.date);

    return res
      .status(200)
      .json(
        new ApiResponse(200, transactions, "All transactions fetched successfully")
      );
  } else {
    // Parse count as an integer
    count = parseInt(count);

    if (!count || isNaN(count) || count < 1) {
      throw new ApiError(400, "Invalid number of transactions provided");
    }

    const numberOfTransactions = parseInt(count);

    // Fetching the last n expenses
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(numberOfTransactions)
      .select("date amount category _id");

    // Fetching the last n incomes
    const incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(numberOfTransactions)
      .select("date amount category _id");

    // Fetching the last n savings
    const savings = await Saving.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(numberOfTransactions)
      .select("date amount category _id");

    // Combine and sort by date
    const transactions = [
      ...expenses.map((transaction) => ({
        type: "Expense",
        ...transaction._doc,
      })),
      ...incomes.map((transaction) => ({ type: "Income", ...transaction._doc })),
      ...savings.map((transaction) => ({ type: "Saving", ...transaction._doc })),
    ].sort((a, b) => b.date - a.date);

    // Limit the result to the last n transactions
    const limitedTransactions = transactions.slice(0, numberOfTransactions);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          limitedTransactions,
          "Transactions fetched successfully"
        )
      );
  }
});

const getAllTransactionInPages = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.p) || 0;
  const transactionPerPage = 6;
  const transactionType = req.query.type; // Get the transaction type from the query string

  let transactions = [];

  if (transactionType === 'expense') {
    // Fetching all expenses
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");
    transactions = expenses.map((transaction) => ({
      type: "Expense",
      ...transaction._doc,
    }));
  } else if (transactionType === 'income') {
    // Fetching all incomes
    const incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");
    transactions = incomes.map((transaction) => ({
      type: "Income",
      ...transaction._doc,
    }));
  } else if (transactionType === 'saving') {
    // Fetching all savings
    const savings = await Saving.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");
    transactions = savings.map((transaction) => ({
      type: "Saving",
      ...transaction._doc,
    }));
  } else {
    // Fetching all transactions
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");
    const incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");
    const savings = await Saving.find({ user: req.user._id })
      .sort({ date: -1 })
      .select("date amount category _id");

    transactions = [
      ...expenses.map((transaction) => ({
        type: "Expense",
        ...transaction._doc,
      })),
      ...incomes.map((transaction) => ({ type: "Income", ...transaction._doc })),
      ...savings.map((transaction) => ({ type: "Saving", ...transaction._doc })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (transactions.length <= (page * transactionPerPage)) {
    throw new ApiError(400, "No data found!");
  }

  const pagedTransactions = transactions.slice(page * transactionPerPage);
  const getFinalArray = pagedTransactions.slice(0, transactionPerPage);

  return res.status(200).json(
    new ApiResponse(200, { data: getFinalArray, total: transactions.length }, "All transactions fetched successfully")
  );
});


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  addProfile,
  getUserFinancialData,
  getTransactionsForLastNDays,
  getSpecificTransactionsForLastNTransactions,
  getAllTransactionsInOrder,
  getAllTransactionInPages
};