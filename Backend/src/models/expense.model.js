import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    user: {
      // Stores which user has added this expense
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      // Stores the amount
      type: Number,
      required: true,
      min: [1, "The amount you have entered is too low"],
    },
    method: {
      // Stores the mode of transaction
      type: String,
      enum: ["Cash", "Credit card", "UPI", "Other"],
      required: true,
    },
    category: {
      // Stores where it was spent on
      type: String,
      required: true,
    },
    description: {
      // Note on that transaction
      type: String,
    },
    date: {
      // Date and time of the transaction
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
