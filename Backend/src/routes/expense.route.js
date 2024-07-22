import { Router } from "express";
import { verifyJWT } from "../middlwares/auth.middleware.js";
import {
  addExpense,
  deleteExpense,
  getAllExpenseInOrder,
  getExpense,
  highestExpenses,
  updateExpense,
} from "../controllers/expense.controller.js";

const router = Router();

// Apply JWT verification middleware to all the routes
router.use(verifyJWT);

router.route("/add-expense").post(addExpense);
router.route("/getExpense/:expenseId").post(getExpense);
router.route("/update-expense/:expenseId").post(updateExpense);
router.route("/delete-expense/:expenseId").delete(deleteExpense);
router.route("/top-expense").post(highestExpenses);
router.route("/get-expense/:count").post(getAllExpenseInOrder);

export default router;