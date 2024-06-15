import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());


// routes import

import userRouter from "./routes/user.route.js"
import incomeRouter from "./routes/income.route.js"
import savingRouter from "./routes/saving.route.js"
import expenseRouter from "./routes/expense.route.js"


// routes declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/income", incomeRouter)
app.use("/api/v1/saving", savingRouter)
app.use("/api/v1/expense", expenseRouter)

// http://localhost:3000/api/v1/user/register


export {app};