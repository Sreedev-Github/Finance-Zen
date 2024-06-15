import mongoose, { Schema } from "mongoose";

const savingSchema = new Schema(
  {
    user: {
      // Stores which user has added this saving
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
      // Stores the mode of savings
      type: String,
      enum: ["cash", "bank account", "investment", "mutual funds", "other"],
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

export const Saving = mongoose.model("Saving", savingSchema);
