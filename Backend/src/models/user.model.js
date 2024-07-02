import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      dateOfBirth: {
        type: Date,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    financialData: {
      totalSavings: {
        type: Number,
        default: 0
      },
      totalIncome: {
        type: Number,
        default: 0
      },
      totalExpense: {
        type: Number,
        default: 0
      },
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

// Define a sparse index for email to ensure uniqueness only when the field is present
userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Pasword hashing
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Password comaparing
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating access and refresh Tokens

// Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    // Takes 3 values =  Payloads, ACCESS TOKEN SECRET, and Expiry
    {
      // These are paylods you can give as much as you want
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.profile.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Refresh token
// Works almost as same as access Token but the difference being the number of days of expiry is high and you have to mention less payloads.
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
