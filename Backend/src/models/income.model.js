import mongoose, { Schema } from "mongoose";

const incomeSchema = new Schema(
  {
    user: {
      // Stores which user has added this income
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
      enum: ["Cash", "Bank credit", "Other"],
      required: true,
    },
    category: {
      // Stores why it was recieved eg: Salary, Mutal Funds
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

export const Income = mongoose.model("Income", incomeSchema);
